const { Client, Collection } = require('discord.js');
const Event = require('../structures/Event');
const EventEmitter = require('node:events');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

const readDirectory = require('node:util').promisify(require('node:fs').readdir);

/**
 * @typedef {Object} EventManagerOptions
 * @property {String} locationEvents The location of the events
 */

/**
 * The event manager.
 * @extends EventEmitter
 * @class
 */
class EventManager extends EventEmitter {

    /**
     * The constructor of the EventManager class.
     * @param {Client} client
     * @param {EventManagerOptions} options
     */
    constructor(client, options) {

        super();

        if(!options.locationEvents || typeof options.locationEvents !== 'string') throw new DisGroupDevError(Messages.INVALID_LOCATION);

        /**
         * The cache with all Events
         * @type {Collection<String, Event>}
         * @public
         */
        this.cache = new Collection();

        /**
         * The client.
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The options of the EventManager.
         * @type {EventManagerOptions}
         * @public
         */
        this.options = options;

    }

    /**
     * Loads an event
     * @param {String} path The full path of the event
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /** @type {Event} */
                const eventFile = new (require(path))(this.client, this);

                if(!eventFile.enabled) reject(new DisGroupDevError(Messages.EVENT_NOT_ENABLED));

                eventFile.location = path;

                if(eventFile.init && typeof eventFile.init === 'function') await eventFile.init();
                if(!eventFile.execute || typeof eventFile.execute !== 'function') throw new DisGroupDevError(Messages.INVALID_EXECUTE(eventFile.name));

                this.cache.set(eventFile.name, eventFile);

                eventFile.once ?

                this.client.once(eventFile.name, (...args) => eventFile.execute(eventFile.client, ...args)) :

                this.client.on(eventFile.name, (...args) => eventFile.execute(eventFile.client, ...args))

                /**
                 * Emitted when an event is loaded.
                 * @event EventManager#eventLoad
                 * @param {Event} eventFile
                 * @public
                 */
                this.emit('eventLoad', eventFile);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads all events
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const eventDirectory = await readDirectory(this.options.locationEvents);

                for(const eventFile of eventDirectory) {

                    await this.load(`${this.options.locationEvents}/${eventFile}`);

                }

                return true;

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads an event
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) return reject(new DisGroupDevError(Messages.EVENT_NOT_FOUND(name)));

            try {

                const { location } = this.cache.get(name);

                await this.unload(name);
                await this.load(location);

                /**
                 * Emitted when an event is reloaded.
                 * @event EventManager#eventReload
                 * @param {Event}
                 * @public
                 */
                this.emit('eventReload', this.cache.get(name));

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads all events
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const event of this.cache) {

                    await this.unload(event.name);

                }

                await this.loadAll();

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads an event
     * @param {String} name THe name of the event
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) return reject(new DisGroupDevError(Messages.EVENT_NOT_FOUND(name)));

            try {

                const { location, execute } = this.cache.get(name);

                this.client.off(name, (...args) => execute(this.client, ...args));

                delete require.cache[require.resolve(location)];

                this.cache.delete(name);

                /**
                 * Emitted when an event is unloaded.
                 * @event EventManager#eventUnload
                 * @param {String} name The name of the event
                 * @public
                 */
                this.emit('eventUnload', name);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads all loaded events
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const event of this.cache) {

                    await this.unload(event.name);

                }

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

}

module.exports = EventManager;
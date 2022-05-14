const EventEmitter = require('node:events');

const Event = require('../structures/Event');
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
     * @param {import('discord.js').Client} client
     * @param {EventManagerOptions} options
     */
    constructor(client, options) {

        super();

        if(!options.locationEvents || typeof options.locationEvents !== 'string') throw new DisGroupDevError(Messages.INVALID_LOCATION);

        /**
         * The client.
         * @type {import('discord.js').Client}
         * @public
         */
        this.client = client;

        /**
         * The options of the EventManager.
         * @type {EventManagerOptions}
         * @public
         */
        this.options = options;

        /**
         * A map with all events
         * @type {Map<String, Event>}
         * @private
         */
        this._events = new Map();

    }

    /**
     * Deletes an event
     * @param {String} name The name of the event
     * @returns {Map<String, Event>|null}
     * @public
     */
    delete(name) {

        if(typeof name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(name));

        if(!this._events.has(name)) return null;

        this._events.delete(name);

        /**
         * Emitted when an event is deleted
         * @event EventManager#eventDelete
         */
        this.emit('eventDelete', this._events);

        return this._events;

    }

    /**
     * Gets an event
     * @param {String} name The name of the event
     * @returns {Event|null}
     * @public
     */
    get(name) {

        if(typeof name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(name));

        return this._events.get(name) ?? null;

    }

    /**
     * Checks if an event exists
     * @param {String} name The name of the event
     * @returns {Boolean}
     * @public
     */
    has(name) {

        if(typeof name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(name));

        return this._events.has(name);

    }

    /**
     * Lists all events
     * @returns {Event[]|null}
     * @public
     */
    get list() {

        return [...this._events.values()];

    }

    /**
     * Loads an event
     * @param {String} path The full path of the event
     * @returns {Promise<Boolean|DisGroupDevError>}
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /** @type {Event} */
                const eventFile = new (require(path))(this.client, this);

                eventFile.location = path;

                if(eventFile.init && typeof eventFile.init === 'function') await eventFile.init();
                if(!eventFile.execute || typeof eventFile.execute !== 'function') throw new DisGroupDevError(Messages.INVALID_EXECUTE(eventFile.name));

                if(eventFile.enabled) {

                    this.set(eventFile.name, eventFile);

                    eventFile.once ?

                    this.client.once(eventFile.name, (...args) => eventFile.execute(eventFile.client, ...args)) :

                    this.client.on(eventFile.name, (...args) => eventFile.execute(eventFile.client, ...args))

                }

                /**
                 * Emitted when an event is loaded
                 * @event EventManager#eventLoad
                 */
                this.emit('eventLoad', eventFile);

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads all events
     * @returns {Promise<Boolean|DisGroupDevError>}
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const eventDirectory = await readDirectory(this.options.locationEvents);

                for(const eventFile of eventDirectory) {

                    await this.load(`${this.options.locationEvents}/${eventFile}`);

                }

                return true;

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads an event
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     */
    reload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.has(name)) return reject(new DisGroupDevError(Messages.EVENT_NOT_FOUND(name)));

            try {

                const { location } = this.get(name);

                await this.unload(name);
                await this.load(location);

                /**
                 * Emitted when an event is reloaded
                 * @event EventManager#eventReload
                 */
                this.emit('eventReload', this.get(name));

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads all events
     * @returns {Promise<Boolean|DisGroupDevError>}
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this.unloadAll();
                await this.loadAll();

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Sets an event
     * @param {String} name The name of the event
     * @param {Event} value The class of the event
     * @returns {?Map<String, Event>}
     * @public
     */
    set(name, value) {

        if(typeof name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(name));
        if(!value instanceof Event) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF('Event', value?.toString()));

        return this._events.set(name, value);

    }

    /**
     * Gets the amount of loaded events
     * @returns {Number}
     */
    get size() {

        return this._events.size;

    }

    /**
     * Unloads an event
     * @param {String} name THe name of the event
     * @returns {Promise<Boolean|DisGroupDevError>}
     */
    unload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.has(name)) return reject(new DisGroupDevError(Messages.EVENT_NOT_FOUND(name)));

            try {

                const { location, execute } = this.get(name);

                this.client.off(name, (...args) => execute(this.client, ...args));

                delete require.cache[require.resolve(location)];

                this.delete(name);

                /**
                 * Emitted when an event is unloaded
                 * @event EventManager#eventUnload
                 */
                this.emit('eventUnload', name);

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads all loaded events
     * @returns {Promise<Boolean|DisGroupDevError>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const event of this.list) {

                    await this.unload(event.name);

                }

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

}

module.exports = EventManager;
const Base = require('../structures/Base');
const Discord = require('discord.js');
const Errors = require('../utils/Errors');
const FileSystem = require('node:fs');
const Util = require('node:util');

/**
 * The options
 * @typedef {Object} EventManagerOptions
 * @property {String} locationEvents The location of the events
 */

/**
 * The event manager for handling events
 * @extends {Base}
 */
class EventManager extends Base {

    /**
     * The constructor for the EventManager
     * @param {Discord.Client} client
     * @param {EventManagerOptions} options
     */
    constructor(client, options = {}) {

        super(client);

        if(!options?.locationEvents || typeof options?.locationEvents !== 'string') throw new Error(Errors.INVALID_SOURCE);

        /**
         * The collection of all events
         * @type {Discord.Collection<String, Event>}
         * @private
         */
        this._events = new Discord.Collection();

        /**
         * Reads a directory
         * @private
         */
        this.readDirectory = Util.promisify(FileSystem.readdir);

        /**
         * The options of the EventManager
         * @type {EventManagerOptions}
         * @public
         */
        this.options = options;

    }

    /**
     * Gets an events
     * @param {String} name The name of the events
     * @returns {?Event}
     */
    get(name) {

        const clientEvent = this._events.get(name);

        return clientEvent ?? null;

    }

    /**
     * Checks if there is any events with a specific name
     * @param {String} name The name of the events
     * @returns {Boolean}
     */
    has(name) {

        return this._events.has(name);

    }

    /**
     * Lists all events
     * @returns {Event[]}
     */
    list() {

        return this._events.toJSON();

    }

    /**
     * Load a specific events
     * @param {String} path The path of the event
     * @returns {Promise<Boolean|Error>}
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /**
                 * @type {Event}
                 */
                const eventFile = new(require(path))(this.client);

                eventFile.setLocation(path);

                if(eventFile?.init && typeof eventFile?.init === 'function') eventFile.init();

                this._events.set(eventFile.name, eventFile);

                if(eventFile.enabled) {

                    eventFile.once ?

                    this.client.once(eventFile.name, (...args) => eventFile.execute(eventFile.client, ...args)) :

                    this.client.on(eventFile.name, (...args) => eventFile.execute(eventFile.client, ...args))

                }

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Loads all events
     * @return {Promise<Boolean|Error>}
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const eventDir = await this.readDirectory(this.options.locationEvents);

                try {

                    for(const eventFile of eventDir) {

                        await this.load(`${this.options.locationEvents}/${eventFile}`);

                    }

                    resolve(true);

                } catch (e) {

                    reject(e);

                }

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads a specific event
     * @param {String} name The name of the event
     * @return {Promise<Boolean|Error>}
     */
    reload(name) {

        const clientEvent = this._events.get(name);

        if(!clientEvent) throw new Error(Errors.EVENT_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                await this.unload(name);

                resolve(await this.load(clientEvent?.location))

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads all event
     * @return {Promise<Boolean|Error>}
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this.unloadAll();

                resolve(await this.loadAll())

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Gets the size of all events
     * @returns {Number}
     */
    size() {

        return this._events.size;

    }

    /**
     * Unloads a specific events
     * @param {String} name The name of the event
     * @return {Promise<Boolean|Error>}
     */
    unload(name) {

        const clientEvent = this._events.get(name);

        if(!clientEvent) throw new Error(Errors.EVENT_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                this.client.off(clientEvent.name, (...args) => clientEvent.execute(clientEvent.client, ...args));

                delete require.cache[require.resolve(clientEvent?.location)];

                this._events.delete(name);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Unload all events
     * @return {Promise<Boolean|Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const eventDir = await this.readDirectory(this.options.locationEvents);

                try {

                    for(const eventFile of eventDir) {

                        if(!this._events.has(eventFile)) return;

                        await this.unload(eventFile);

                    }

                    resolve(true);

                } catch (e) {

                    reject(e);

                }

            } catch (e) {

                reject(e);

            }

        });

    }

}

module.exports = EventManager;
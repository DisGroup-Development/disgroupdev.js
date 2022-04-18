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
    list() {

        return [...this._events.values()];

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
        if(!value instanceof Event) throw new DisGroupDevError(Messages.NOT_A_FUNCTION(value));

        return this._translations.set(name, value);

    }

}

module.exports = EventManager;
'use strict';

/**
 * @typedef {Object} EventData
 * @property {Boolean} enabled If the event is enabled for loading. (default: true)
 * @property {String} name The name of the event.
 * @property {Boolean} once If the event should only be triggered once. (default: false)
 * @property {String} location The location of the event (Will be set automatically)
 */

/**
 * The event class.
 * @class
 */
class Event {
    /**
     * The constructor of the event class.
     * @param {Client} client The client
     * @param {EventManager} manager The event manager
     * @param {EventData} data The data of the event
     */
    constructor(client, manager, data = {}) {
        /**
         * The client.
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The event manager.
         * @type {EventManager}
         * @public
         */
        this.manager = manager;

        /**
         * The raw event data.
         * @type {EventData}
         * @private
         */
        this.data = data;
    }

    /**
     * If the event is enabled for loading or not.
     * @returns {Boolean}
     * @public
     */
    get enabled() {
        return this.data.enabled ?? true;
    }

    /**
     * Loads the event.
     * @returns {Promise<Boolean | DisGroupDevError>}
     * @public
     */
    load() {
        return this.manager.load(this.location);
    }

    /**
     * Gets the location of the event.
     * @returns {String}
     * @public
     */
    get location() {
        return this.data.location ?? ' ';
    }

    /**
     * Sets the location of the event.
     * @param {String} path The new path of the event.
     * @public
     */
    set location(path) {
        this.data.location = path;
    }

    /**
     * The name of the event.
     * @returns {String}
     * @public
     */
    get name() {
        return this.data.name ?? null;
    }

    /**
     * If the event is once or not.
     * @returns {Boolean}
     * @public
     */
    get once() {
        return this.data.once ?? false;
    }

    /**
     * Reloads the event.
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload() {
        return this.manager.reload(this.name);
    }

    /**
     * Unloads the event.
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload() {
        return this.manager.unload(this.name);
    }

    /**
     * The full data of the event
     * @returns {EventData}
     * @public
     */
    toJSON() {
        return { ...this.data };
    }
}

module.exports = Event;

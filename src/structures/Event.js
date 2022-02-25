const Base = require('./Base');
const Discord = require('discord.js');
const Errors = require('../utils/Errors');

/**
 * @typedef {Object} EventData The raw data of the event
 * @property {String} name The name of the event
 * @property {?Boolean} enabled If the event is enabled (Default: true)
 * @property {?String} location The location of the event (Will be set automatically)
 * @property {?Boolean} once If the event is once (Default: false)
 */

/**
 * The base of all event
 * @extends {Base}
 */
class Event extends Base {

    /**
     * The constructor of the event
     * @param client {Discord.Client}
     * @param data {EventData}
     */
    constructor(client, data = {}) {

        super(client);

        if(!this?.execute || typeof this?.execute !== 'function') throw new Error(Errors.EVENT_NEEDS_EXECUTE);

        /**
         * The raw data of the event
         * @type {EventData}
         * @private
         */
        this.data = data;

    }

    /**
     * Checks if the event is enabled
     * @returns {Boolean}
     * @public
     */
    get enabled() {

        return this.data?.enabled ?? true;

    }

    /**
     * Gets the location of the event
     * @return {String}
     * @public
     */
    get location() {

        return this.data?.location ?? ' ';

    }

    /**
     * Gets the name of the event
     * @returns {String}
     * @public
     */
    get name() {

        return this.data?.name ?? ' ';

    }

    /**
     * Checks if the event is once
     * @property {Boolean}
     * @public
     */
    get once() {

        return this.data?.once ?? false;

    }

    /**
     * Sets the location of the event
     * @param {String} path The new path of the event
     * @returns {String}
     * @public
     */
    setLocation(path) {

        this.data.location = path;

        return this.location;

    }

}

module.exports = Event;
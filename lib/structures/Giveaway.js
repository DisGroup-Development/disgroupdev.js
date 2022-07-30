const { Client } = require('discord.js');

/**
 * @typedef {Object} GiveawayData
 * @property {Number} startAt The start date of the giveaway
 * @property {Number} endAt The end date of the giveaway
 * @property {Number} winners The amout of winners for this giveaway
 * @property {Boolean} ended If the giveaway has ended
 */

/**
 * The Giveaway class
 * @class
 */
class Giveaway {

    /**
     * The constructor of the Giveaway class
     * @param {Client} client 
     * @param {GiveawayManager} manager 
     * @param {GiveawayData} data
     */
    constructor(client, manager, data) {

        /**
         * The client
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The manager of the giveaway
         * @type {GiveawayManager}
         * @public
         */
        this.manager = manager;

        /**
         * The raw data of the giveaway
         * @type {GiveawayData}
         * @private
         */
        this.data = data;

    }

    /**
     * Returns the full data of the giveaway
     * @returns {GiveawayData}
     * @public
     */
    toJSON() {

        return { ...this.data };

    }

}

module.exports = Giveaway;
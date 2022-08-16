const { Client } = require('discord.js');
const EventEmitter = require('node:events');
const FileSystem = require('node:fs');

const Giveaway = require('../structures/Giveaway');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * @typedef {Object} GiveawayManagerOptions
 * @property {String} storage The json file to save the giveaways to
 */

/**
 * The giveaway manager class
 * @extends {EventEmitter}
 * @class
 */
class GiveawayManager extends EventEmitter {

    /**
     * The constructor of the giveaway manager class
     * @param {Client} client The client
     * @param {GiveawayManagerOptions} options The options of the giveaway manager
     */
    constructor(client, options) {

        super();

        if(!client || !client instanceof Client) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(client, Client));

        /**
         * The client
         * @type {Client}
         * @public
         */
        this.client = client;

        if(!options?.storage || typeof options.storage !== 'string') throw new DisGroupDevError(Messages.INVALID_LOCATION);

        /**
         * The options of the giveaway manager
         * @type {GiveawayManagerOptions}
         * @public
         */
        this.options = options;

        /**
         * The cache with all giveaways
         * @type {Array<Giveaway>}
         * @public
         */
        this.cache = new Array();

        /**
         * If the giveaways are loaded
         * @type {Boolean}
         * @public
         */
        this.isReady = false;

        this._init();

    }

    async _init() {



    }

    async _checkGiveaways() {



    }

    async _getGiveaways() {



    }

    async handleRawPackage(package) {

        

    }

    /**
     * Saves the giveaways to the json file
     * @returns {Boolean|DisGroupDevError}
     * @public
     */
    async save() {

        try {

            await FileSystem.writeFileSync(this.options.storage, JSON.stringify(this.giveaways.map((giveaway) => giveaway.data), null, 4), { encoding: 'utf-8' });

            return true;

        } catch(e) {

            throw new DisGroupDevError(e);

        }

    }

}

module.exports = GiveawayManager;
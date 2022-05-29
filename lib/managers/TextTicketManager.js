const { Client, Collection, Snowflake } = require('discord.js');
const BaseTicketManager = require('./BaseTicketManager');
const TextTicket = require('../structures/TextTicket');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * @typedef {Object} TextTicketManagerOptions
 * @property {String} channelTopic The topic of the ticket channel
 * @property {Snowflake} closedParentId The id of the closed tickte category (default: #parentId)
 * @property {Snowflake} parentId The id of the ticket category
 * @property {Array<Snowflake>} staffRoles The IDs of the staff roles
 * @property {String} storage The json file to save the tickets to
 */

/**
 * @typedef {Object} TicketDataRaw
 * @property {Snowflake} channelId The id of the ticket channel or thread
 * @property {Snowflake} guildId The id of the guild
 * @property {Number} number The number of the ticket
 * @property {Array<Snowflake>} participants The array with all ids of participants
 * @property {TicketDataStatus} status The status of the ticket
 * @property {TicketDataType} type The type of the ticket
 * @property {Snowflake} userId The id of the user
 */

/**
 * The text ticket manager class.
 * @extends {BaseTicketManager}
 * @class
 */
class TextTicketManager extends BaseTicketManager {

    /**
     * The constructor of the text ticket manager class.
     * @param {Client} client
     * @param {TextTicketManagerOptions} options
     */
    constructor(client, options) {

        super(client, options);

        /**
         * The cache with all text tickets
         * @type {Collection<Number, TextTicket>}
         */
        this.cache = new Collection();

        /**
         * The options of the text ticket manager
         * @type {TextTicketManagerOptions}
         * @public
         */
        this.options = options;

        this.options.closedParentId = this.options.closedParentId ?? this.options.parentId;

        this._init();

    }

    /**
     * Inits the manager
     * @private
     */
    async _init() {

        const loadedTickets = await this._getTickets();

        this._rawTickets = loadedTickets;

        for(const rawTicket of loadedTickets) {

            const textTicket = new TextTicket(this.client, this, rawTicket);

            this.cache.set(textTicket.number, textTicket);

        }

        this.isReady = true;
    }

}

module.exports = TextTicketManager;
'use strict';

const EventEmitter = require('node:events');
const FileSystem = require('node:fs');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * @typedef {Object} BaseTicketManagerOptions
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
 * @typedef {String} TicketDataStatus
 * * "CLOSED"
 * * "DELETED"
 * * "OPEN"
 */

/**
 * @typedef {String} TicketDataType
 * * "CHANNEL"
 */

/**
 * The base ticket manager class.
 * @class
 */
class BaseTicketManager extends EventEmitter {
    /**
     * The constructor of the base ticket manager class.
     * @param {Client} client The client
     * @param {BaseTicketManagerOptions} options The options of the base ticket manager
     */
    constructor(client, options) {
        super();

        /**
         * The client
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The options of the base ticket manager
         * @type {BaseTicketManagerOptions}
         * @public
         */
        this.options = options;

        /**
         * The raw tickets
         * @type {Array<TicketDataRaw>}
         * @private
         */
        this._rawTickets = [];

        /**
         * If the tickets are loaded.
         * @type {Boolean}
         * @public
         */
        this.isReady = false;
    }

    /**
     * Gets the raw ticket data from the json file
     * @returns {Array<TicketDataRaw>|DisGroupDevError}
     * @private
     */
    async _getTickets() {
        const storage = FileSystem.existsSync(this.options.storage);

        if (!storage) {
            FileSystem.writeFileSync(this.options.storage, JSON.stringify([], null, 4), { encoding: 'utf-8' });

            return [];
        } else {
            const storageContent = FileSystem.readFileSync(this.options.storage, { encoding: 'utf-8' });

            try {
                const ticketArray = await JSON.parse(storageContent.toString());

                if (Array.isArray(ticketArray)) {
                    return ticketArray;
                } else {
                    throw new DisGroupDevError(Messages.INVALID_JSON);
                }
            } catch (e) {
                throw new DisGroupDevError(e);
            }
        }
    }

    /**
     * Checks if a user has multiple tickets
     * @param {Snowflake} guildId The id of the guild
     * @param {Snowflake} userId The id of the user
     * @returns {Promise<Boolean>}
     * @public
     */
    checkDoubleTickets(guildId, userId) {
        return !!this._rawTickets.find(ticket => ticket.guildId === guildId && ticket.userId === userId);
    }

    /**
     * Resolves a guild
     * @param {GuildResolvable} guild The guild to resolve
     * @returns {Guild|null}
     * @public
     */
    resolveGuild(guild) {
        return this.client.guilds.resolve(guild);
    }

    /**
     * Resolves a user
     * @param {UserResolvable} user The user to resolve
     * @returns {User|null}
     * @public
     */
    resolveUser(user) {
        return this.client.users.resolve(user);
    }

    /**
     * Saves the ticket to the json file
     * @returns {Boolean|DisGroupDevError}
     * @public
     */
    save() {
        try {
            FileSystem.writeFileSync(this.options.storage, JSON.stringify(this._rawTickets, null, 4), { encoding: 'utf-8' });

            return true;
        } catch (e) {
            throw new DisGroupDevError(e);
        }
    }
}

module.exports = BaseTicketManager;

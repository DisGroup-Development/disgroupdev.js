const { Client, Guild, GuildMember, Snowflake, TextChannel, User } = require('discord.js');

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
 * The base ticket class.
 * @class
 */
class BaseTicket {

    /**
     * The constructor of the base ticket class.
     * @param {Client} client
     * @param {BaseTicketManager} manager
     * @param {TicketDataRaw} data
     */
    constructor(client, manager, data = {}) {

        /**
         * The client
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The manager of the ticket
         * @type {BaseTicketManager}
         * @public
         */
        this.manager = manager;

        /**
         * The raw data of the ticket
         * @type {TicketDataRaw}
         * @private
         */
        this.data = data;

    }

    /**
     * The channel of the ticket
     * @returns {TextChannel}
     * @public
     */
    get channel() {

        return this.guild.channels.resolve(this.channelId);

    }

    /**
     * The channel id of the ticket
     * @returns {Snowflake|null}
     * @public
     */
    get channelId() {

        return this.data.channelId ?? null;

    }

    /**
     * The guild of the ticket
     * @returns {Guild}
     * @public
     */
    get guild() {

        return this.manager.resolveGuild(this.guildId);

    }

    /**
     * The guild id of the ticket
     * @returns {Snowflake|null}
     * @public
     */
    get guildId() {

        return this.data.guildId ?? null;

    }

    /**
     * The guild member of the ticket creator
     * @returns {GuildMember}
     * @public
     */
    get member() {

        return this.guild.members.resolve(this.userId);

    }

    /**
     * The number of the ticket
     * @returns {Number|null}
     * @public
     */
    get number() {

        return this.data.number ?? null;

    }

    /**
     * The participants of the ticket
     * @returns {Array<Snowflake>}
     * @public
     */
    get participants() {

        return this.data.participants ?? [];

    }

    /**
     * The status of the ticket
     * @returns {TicketDataStatus|null}
     * @public
     */
    get status() {

        return this.data.status ?? null;

    }

    /**
     * The type of the ticket
     * @returns {TicketDataType|null}
     * @public
     */
    get type() {

        return this.data.type ?? null;

    }

    /**
     * The user of the ticket creator
     * @returns {User}
     * @public
     */
    get user() {

        return this.client.users.resolve(this.userId);

    }

    /**
     * The user id of the creator of the ticket
     * @returns {Snowflake|null}
     */
    get userId() {

        return this.data.userId ?? null;

    }
}

module.exports = BaseTicket;
const Discord = require('discord.js');

/**
 * @typedef {Object} RawTextTicketData
 * @property {Discord.Snowflake} channelId The id of the ticket channel
 * @property {Discord.Snowflake} creatorId The id of the creator of the ticket
 * @property {Discord.Snowflake} guildId The id of the guild of the ticket
 * @property {Number} number The number of the ticket
 * @property {Array<Discord.Snowflake} participants The participants of the ticket
 * @property {String} status The status of the ticket (open, closed)
 */

/**
 * The Text Ticket
 */
class TextTicket {

    /**
     * The constructor of the Text Ticket
     * @param {TextTicketManager} manager 
     * @param {RawTextTicketData} data 
     */
    constructor(manager, data) {

        /**
         * The manager of the ticket
         * @type {TextTicketManager}
         */
        this.manager = manager;

        /**
         * The id of the ticket channel
         * @type {Discord.Snowflake}
         */
        this.channelId = data?.channelId;

        /**
         * The id of the creator of the ticket
         * @type {Discord.Snowflake}
         */
        this.creatorId = data?.creatorId;

        /**
         * The id of the guild of the ticket
         * @type {Discord.Snowflake}
         */
        this.guildId = data?.guildId;

        /**
         * The number of the ticket
         * @type {Number}
         */
        this.number = data?.number;

        /**
         * The participants of the ticket
         * @type {Array<Discord.Snowflake>}
         */
        this.participants = data?.participants;

        /**
         * The status of the ticket (open, closed)
         * @type {String}
         */
        this.status = data?.status;

        /**
         * The raw data of the ticket
         * @private
         */
        this._data = data;

    }

    /**
     * Adds a participant to the ticket
     * @param {Discord.GuildMemberResolvable} member 
     * @returns {TextTicket|null}
     */
    async addMember(member) {

        const guildMember = this.guild.members.resolve(member);

        if(!guildMember || !guildMember instanceof Discord.GuildManager) return null;

        await this.channel.permissionOverwrites.edit(guildMember, {

            VIEW_CHANNEL: true,
            SEND_MESSAGES: true

        });

        this.participants.push(guildMember.id);

        return this;

    }

    /**
     * The channel of the ticket
     * @type {Discord.TextChannel}
     */
    get channel() {

        return this.guild.channels.resolve(this.channelId);


    }

    /**
     * Closes the ticket
     * @returns {TextTicket}
     */
    async close() {

        return await this.manager.close(this);

    }

    /**
     * Deletes the ticket
     * @returns {TextTicket}
     */
    async delete() {

        return await this.manager.delete(this);

    }

    /**
     * The guild of the ticket
     * @type {Discord.Guild}
     */
    get guild() {

        return this.manager.client.guilds.resolve(this.guildId);

    }

    /**
     * The member of the ticket
     * @type {Discord.GuildMember}
     */
    get member() {

        return this.guild.members.resolve(this.creatorId);

    }

    /**
     * Removes a participant from the ticket
     * @param {Discord.GuildMemberResolvable} member 
     * @returns {TextTicket|null}
     */
    async removeMember(member) {

        const guildMember = this.guild.members.resolve(member);

        if(!guildMember || !guildMember instanceof Discord.GuildManager) return null;

        await this.channel.permissionOverwrites.edit(guildMember, {

            VIEW_CHANNEL: false,
            SEND_MESSAGES: false

        });

        if(this.participants.includes(guildMember.id)) this.participants = this.participants.filter((id) => id !== guildMember.id);

        return this;

    }

    /**
     * Renames the ticket
     * @param {String} newName 
     * @returns {TextTicket}
     */
    async rename(newName) {

        return await this.manager.rename(this, newName);

    }

    /**
     * Reopens the ticket
     * @returns {TextTicket}
     */
    async reopen() {

        return await this.manager.reopen(this);

    }

    /**
     * The user of the ticket
     * @type {Discord.User}
     */
    get user() {

        return this.manager.client.users.resolve(this.creatorId);

    }

}

module.exports = TextTicket;
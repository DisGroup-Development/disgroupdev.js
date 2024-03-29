'use strict';

const BaseTicket = require('./BaseTicket');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * The text ticket class.
 * @extends {BaseTicket}
 * @class
 */
class TextTicket extends BaseTicket {
    /**
     * The constructor of the text ticket class.
     * @param {Client} client The client
     * @param {TextTicketManager} manager The texst ticket manager
     * @param {TicketDataRaw} data The data of the text ticket
     */
    constructor(client, manager, data = {}) {
        super(client, manager, data);

        /**
         * The manager of the ticket
         * @type {TextTicketManager}
         * @public
         */
        this.manager = manager;
    }

    /**
     * Adds a member to the ticket
     * @param {GuildMemberResolvable} member The member to add
     * @returns {Promise<TextTicket>|DisGroupDevError}
     * @public
     */
    async addMember(member) {
        const guildMember = this.guild.members.resolve(member);

        if (!guildMember) throw new DisGroupDevError(Messages.UNRESOLVABLE_GUILD_MEMBER(this.guildId, member));

        await this.channel.permissionOverwrites.edit(guildMember, {

            AttachFiles: true,
            AddReactions: true,
            EmbedLinks: true,
            ReadMessageHistory: true,
            SendMessages: true,
            UseExternalEmojis: true,
            UseExternalStickers: true,
            ViewChannel: true,

        });

        const ticketData = this.data;

        this.data.participants.push(guildMember.id);

        this.manager._rawTickets[this.manager._rawTickets.indexOf(ticketData)] = this.data;

        await this.manager.save();

        return this;
    }

    /**
     * Closes the ticket
     * @returns {Promise<TextTicket>|DisGroupDevError}
     * @public
     */
    close() {
        return this.manager.closeTicket(this);
    }

    /**
     * Deletes the ticket
     * @returns {Promise<Boolean>|DisGroupDevError}
     * @public
     */
    delete() {
        return this.manager.deleteTicket(this);
    }

    /**
     * Removes a member to the ticket
     * @param {GuildMemberResolvable} member The member to remove
     * @returns {Promise<TextTicket>|DisGroupDevError}
     * @public
     */
    async removeMember(member) {
        const guildMember = this.guild.members.resolve(member);

        if (!guildMember) throw new DisGroupDevError(Messages.UNRESOLVABLE_GUILD_MEMBER(this.guildId, member));

        await this.channel.permissionOverwrites.edit(guildMember, {

            AttachFiles: false,
            AddReactions: false,
            EmbedLinks: false,
            ReadMessageHistory: false,
            SendMessages: false,
            UseExternalEmojis: false,
            UseExternalStickers: false,
            ViewChannel: false,

        });

        const ticketData = this.data;

        this.data.participants = this.data.participants.filter(id => id !== guildMember.id);

        this.manager._rawTickets[this.manager._rawTickets.indexOf(ticketData)] = this.data;

        await this.manager.save();

        return this;
    }

    /**
     * Renames the ticket
     * @param {String} name The new name of the ticket
     * @returns {Promise<TextTicket>|DisGroupDevError}
     * @public
     */
    rename(name) {
        return this.manager.renameTicket(this, name);
    }

    /**
     * Reopens the ticket
     * @returns {Promise<TextTicket>|DisGroupDevError}
     * @public
     */
    reopen() {
        return this.manager.reopenTicket(this);
    }
}

module.exports = TextTicket;

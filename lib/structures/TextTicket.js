const { Client, GuildMemberResolvable } = require('discord.js');
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
     * @param {Client} client
     * @param {TextTicketManager} manager
     * @param {TicketDataRaw} data
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
     * @param {GuildMemberResolvable} member
     * @returns {Promise<TextTicket>|DisGroupDevError}
     * @public
     */
    async addMember(member) {

        const guildMember = this.guild.members.resolve(member);

        if(!guildMember) throw new DisGroupDevError(Messages.UNRESOLVABLE_GUILD_MEMBER(this.guildId, member));

        await this.channel.permissionOverwrites.edit(guildMember, {

            VIEW_CHANNEL: true,
            ATTACH_FILES: true,
            EMBED_LINKS: true,
            SEND_MESSAGES: true

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
     * @param {GuildMemberResolvable} member
     * @returns {Promise<TextTicket>|DisGroupDevError}
     * @public
     */
    async removeMember(member) {

        const guildMember = this.guild.members.resolve(member);

        if(!guildMember) throw new DisGroupDevError(Messages.UNRESOLVABLE_GUILD_MEMBER(this.guildId, member));

        await this.channel.permissionOverwrites.edit(guildMember, {

            VIEW_CHANNEL: false,
            ATTACH_FILES: false,
            EMBED_LINKS: false,
            SEND_MESSAGES: false

        });

        const ticketData = this.data;

        this.data.participants = this.data.participants.filter((id) => id !== guildMember.id);

        this.manager._rawTickets[this.manager._rawTickets.indexOf(ticketData)] = this.data;

        await this.manager.save();

        return this;

    }

    /**
     * Renames the ticket
     * @param {String} name
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
'use strict';

const { ChannelType, OverwriteType, PermissionFlagsBits } = require('discord-api-types/v10');
const { CategoryChannel, Collection, Guild, GuildMember, Role, User } = require('discord.js');
const BaseTicketManager = require('./BaseTicketManager');
const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');
const TextTicket = require('../structures/TextTicket');


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
     * @param {Client} client The client
     * @param {TextTicketManagerOptions} options The options of the text ticket manager
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

        for (const rawTicket of loadedTickets) {
            const textTicket = new TextTicket(this.client, this, rawTicket);

            this.cache.set(textTicket.number, textTicket);
        }

        this.isReady = true;
    }

    /**
     * Closes a ticket
     * @param {TextTicket} ticket The text ticket you want to close
     * @returns {Promise<TextTicket|DisGroupDevError>}
     * @public
     */
    closeTicket(ticket) {
        return new Promise(async (resolve, reject) => {
            if (!this.isReady) reject(new DisGroupDevError(Messages.NOT_READY));

            if (!ticket || !(ticket instanceof TextTicket)) reject(new DisGroupDevError(Messages.NOT_INSTANCE_OF(TextTicket, ticket)));
            if (ticket.status === 'CLOSED') reject(new DisGroupDevError(Messages.TICKET_CLOSED(ticket.number)));

            const resolvedClosedTicketCategory = ticket.guild.channels.resolve(this.options.closedParentId);

            if (!resolvedClosedTicketCategory || !(resolvedClosedTicketCategory instanceof CategoryChannel)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_CATEGORY(ticket.guildId, this.options.closedParentId)));

            /** @type {OverwriteData[]} */
            const ticketPermissions = [];

            ticketPermissions.push({
                id: ticket.userId,
                deny: [
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.AddReactions,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.UseExternalEmojis,
                    PermissionFlagsBits.UseExternalStickers,
                    PermissionFlagsBits.ViewChannel,
                ],
                type: OverwriteType.Member,
            });
            ticketPermissions.push({
                id: ticket.guildId,
                deny: [PermissionFlagsBits.ViewChannel],
                type: OverwriteType.Role,
            });

            for (const participant of ticket.participants) {
                const resolvedParticipant = await ticket.guild.members.fetch(participant);

                if (!resolvedParticipant) return;

                ticketPermissions.push({
                    id: resolvedParticipant.id,
                    deny: [
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.AddReactions,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.UseExternalEmojis,
                        PermissionFlagsBits.UseExternalStickers,
                        PermissionFlagsBits.ViewChannel,
                    ],
                    type: OverwriteType.Member,
                });
            }

            for (const staffRole of this.options.staffRoles) {
                const resolvedStaffRole = ticket.guild.roles.resolve(staffRole);

                if (!resolvedStaffRole || !(resolvedStaffRole instanceof Role)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_ROLE(ticket.guildId, staffRole)));

                ticketPermissions.push({
                    id: resolvedStaffRole.id,
                    deny: [
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.AddReactions,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.UseExternalEmojis,
                        PermissionFlagsBits.UseExternalStickers,
                        PermissionFlagsBits.ViewChannel,
                    ],
                     type: OverwriteType.Role,
                });
            }

            await ticket.channel.edit({
                name: `closed-${ticket.number}`,
                parent: resolvedClosedTicketCategory.id,
                permissionOverwrites: ticketPermissions,
            });

            ticket.data.status = 'CLOSED';

            const newTicket = new TextTicket(this.client, this, ticket.data);

            this._rawTickets[this._rawTickets.indexOf(ticket.data)] = ticket.data;

            await this.save();

            this.cache.set(ticket.number, newTicket);


            /**
             * Emitted when a ticket is closed
             * @event TextTicketManager#ticketClose
             * @param {TextTicket} ticket
             */
            this.emit('ticketClose', newTicket);

            resolve(newTicket);
        });
    }

    /**
     * Creates a ticket for a user
     * @param {GuildResolvable} guild The guild of the ticket
     * @param {UserResolvable} user The user who created the ticket
     * @returns {Promise<TextTicket|DisGroupDevError>}
     * @public
     */
    createTicket(guild, user) {
        return new Promise(async (resolve, reject) => {
            if (!this.isReady) reject(new DisGroupDevError(Messages.NOT_READY));

            const resolvedGuild = this.resolveGuild(guild);

            if (!resolvedGuild || !(resolvedGuild instanceof Guild)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_GUILD(guild)));

            const resolvedUser = this.resolveUser(user);

            if (!resolvedUser || !(resolvedUser instanceof User)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_USER(user)));

            const resolvedMember = await resolvedGuild.members.fetch(resolvedUser);

            if (!resolvedMember || !(resolvedMember instanceof GuildMember)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_GUILD_MEMBER(resolvedGuild.id, resolvedUser.id)));

            const resolvedTicketCategory = resolvedGuild.channels.resolve(this.options.parentId);

            if (!resolvedTicketCategory || !(resolvedTicketCategory instanceof CategoryChannel)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_CATEGORY(resolvedGuild.id, this.options.parentId)));

            const guildTickets = this._rawTickets.filter(rawTicket => rawTicket.guildId === resolvedGuild.id);
            let ticketNumber = 0;

            if (guildTickets.length > 0) ticketNumber = guildTickets.sort((a, b) => b.number - a.number)[0].number;

            const newTicketNumber = (parseInt(String(ticketNumber)) + 1).toString();
            /** @type {OverwriteData[]} */
            const ticketPermissions = [];

            ticketPermissions.push({
                id: resolvedUser.id,
                allow: [
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.AddReactions,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.UseExternalEmojis,
                    PermissionFlagsBits.UseExternalStickers,
                    PermissionFlagsBits.ViewChannel,
                ],
                type: OverwriteType.Member,
            });
            ticketPermissions.push({
                id: resolvedGuild.id,
                deny: [PermissionFlagsBits.ViewChannel],
                type: OverwriteType.Role,
            });

            for (const staffRole of this.options.staffRoles) {
                const resolvedStaffRole = resolvedGuild.roles.resolve(staffRole);

                if (!resolvedStaffRole || !(resolvedStaffRole instanceof Role)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_ROLE(resolvedGuild.id, staffRole)));

                ticketPermissions.push({
                    id: resolvedStaffRole.id,
                    allow: [
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.AddReactions,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.UseExternalEmojis,
                        PermissionFlagsBits.UseExternalStickers,
                        PermissionFlagsBits.ViewChannel,
                    ],
                    type: OverwriteType.Role,
                });
            }

            const ticketChannel = await resolvedGuild.channels.create({
                name: `ticket-${newTicketNumber}`,
                parent: resolvedTicketCategory.id,
                permissionOverwrites: ticketPermissions,
                topic: this.options.channelTopic ?? null,
                type: ChannelType.GuildText,
            });

            const ticket = new TextTicket(this.client, this, {
                channelId: ticketChannel.id,
                guildId: resolvedGuild.id,
                number: newTicketNumber,
                participants: [resolvedUser.id],
                status: 'OPEN',
                userId: resolvedUser.id,
            });

            this._rawTickets.push(ticket.data);

            this.save();

            this.cache.set(ticket.number, ticket);

            /**
             * Emitted when a ticket is created
             * @event TextTicketManager#ticketCreate
             * @param {TextTicket} ticket
             */
            this.emit('ticketCreate', ticket);

            resolve(ticket);
        });
    }

    /**
     * Deletes a ticket
     * @param {TextTicket} ticket The ticket to delete
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    deleteTicket(ticket) {
        return new Promise(async (resolve, reject) => {
            if (!this.isReady) reject(new DisGroupDevError(Messages.NOT_READY));

            if (!ticket || !(ticket instanceof TextTicket)) reject(new DisGroupDevError(Messages.NOT_INSTANCE_OF(TextTicket, ticket)));

            await ticket.channel.delete();

            ticket.data.status = 'DELETED';

            this._rawTickets = this._rawTickets.filter(rawTicket => rawTicket.channelId !== ticket.channelId);

            this.save();

            this.cache.delete(ticket.number);

            /**
             * Emitted when a ticket is deleted
             * @event TextTicketManager#ticketDelete
             * @param {TextTicket} ticket
             */
            this.emit('ticketDelete', ticket);

            resolve(true);
        });
    }

    /**
     * Renames a ticket
     * @param {TextTicket} ticket The ticket to rename
     * @param {String} name The new name of the ticket
     * @returns {Promise<TextTicket|DisGroupDevError>}
     * @public
     */
    renameTicket(ticket, name) {
        return new Promise(async (resolve, reject) => {
            if (!this.isReady) reject(new DisGroupDevError(Messages.NOT_READY));

            if (!ticket || !(ticket instanceof TextTicket)) reject(new DisGroupDevError(Messages.NOT_INSTANCE_OF(TextTicket, ticket)));

            await ticket.channel.edit({ name: `${name}-${ticket.number}` });

            /**
             * Emitted when a ticket is renamed
             * @event TextTicketManager#ticketRename
             * @param {TextTicket} ticket
             */
            this.emit('ticketRename', ticket);

            resolve(ticket);
        });
    }

    /**
     * Reopens a ticket
     * @param {TextTicket} ticket The ticket to reopen
     * @returns {Promise<TextTicket|DisGroupDevError>}
     * @public
     */
    reopenTicket(ticket) {
        return new Promise(async (resolve, reject) => {
            if (!this.isReady) reject(new DisGroupDevError(Messages.NOT_READY));

            if (!ticket || !(ticket instanceof TextTicket)) reject(new DisGroupDevError(Messages.NOT_INSTANCE_OF(TextTicket, ticket)));
            if (ticket.status === 'OPEN') reject(new DisGroupDevError(Messages.TICKET_OPEN(ticket.number)));

            const resolvedTicketCategory = ticket.guild.channels.resolve(this.options.parentId);

            if (!resolvedTicketCategory || !(resolvedTicketCategory instanceof CategoryChannel)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_CATEGORY(ticket.guildId, this.options.parentId)));

            /** @type {OverwriteData[]} */
            const ticketPermissions = [];

            ticketPermissions.push({
                id: ticket.userId,
                allow: [
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.AddReactions,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.UseExternalEmojis,
                    PermissionFlagsBits.UseExternalStickers,
                    PermissionFlagsBits.ViewChannel,
                ],
                type: OverwriteType.Member,
            });
            ticketPermissions.push({
                id: ticket.guildId,
                deny: [PermissionFlagsBits.ViewChannel],
                type: OverwriteType.Role,
            });

            for (const participant of ticket.participants) {
                const resolvedParticipant = await ticket.guild.members.fetch(participant);

                if (!resolvedParticipant) return;

                ticketPermissions.push({
                    id: resolvedParticipant.id,
                    allow: [
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.AddReactions,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.UseExternalEmojis,
                        PermissionFlagsBits.UseExternalStickers,
                        PermissionFlagsBits.ViewChannel,
                    ],
                    type: OverwriteType.Member,
                });
            }

            for (const staffRole of this.options.staffRoles) {
                const resolvedStaffRole = ticket.guild.roles.resolve(staffRole);

                if (!resolvedStaffRole || !(resolvedStaffRole instanceof Role)) reject(new DisGroupDevError(Messages.UNRESOLVABLE_ROLE(ticket.guildId, staffRole)));

                ticketPermissions.push({
                    id: resolvedStaffRole.id,
                    allow: [
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.AddReactions,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.UseExternalEmojis,
                        PermissionFlagsBits.UseExternalStickers,
                        PermissionFlagsBits.ViewChannel,
                    ],
                    type: OverwriteType.Role,
                });
            }

            await ticket.channel.edit({
                name: `ticket-${ticket.number}`,
                parent: resolvedTicketCategory.id,
                permissionOverwrites: ticketPermissions,
            });

            ticket.data.status = 'OPEN';

            const newTicket = new TextTicket(this.client, this, ticket.data);

            this._rawTickets[this._rawTickets.indexOf(ticket.data)] = ticket.data;

            this.save();

            this.cache.set(ticket.number, newTicket);


            /**
             * Emitted when a ticket is reopened
             * @event TextTicketManager#ticketReopen
             * @param {TextTicket} ticket
             */
            this.emit('ticketReopen', newTicket);

            resolve(newTicket);
        });
    }
}

module.exports = TextTicketManager;

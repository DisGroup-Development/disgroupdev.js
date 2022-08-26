const { BaseGuildTextChannel, Client, ColorResolvable, EmojiIdentifierResolvable, GuildMember, MessageMentionOptions, MessageReaction, Snowflake, User, resolveColor, resolvePartialEmoji } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const { EmbedBuilder, EmbedFooterOptions } = require('@discordjs/builders');
const EventEmitter = require('node:events');
const FileSystem = require('node:fs');
const Utils = require('../utils/Utilities');

const Giveaway = require('../structures/Giveaway');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * @typedef {Object} GiveawayData
 * @property {?MessageMentionOptions} allowedMentions The allowed mentions in the giveaway message
 * @property {?Boolean} botsCanWin If bots can win the giveaway (default: false)
 * @property {Snowflake} channelId The id of the channel the giveaway is in
 * @property {?ColorResolvable} embedColor The color of the embed (default: #3496eb)
 * @property {?ColorResolvable} embedColorEnded The color of the embed when the giveaway has ended (default: #ffde22)
 * @property {Number} endAt The end date of the giveaway
 * @property {Boolean} ended If the giveaway has ended
 * @property {Array<Snowflake>} exceptMembers The ids of the members who can't win the giveaway (default: [])
 * @property {Array<PermissionFlagsBits>} exceptPermissions The permissions for the user to not be able to win the giveaway (default: [])
 * @property {Snowflake} guildId The id of the guild the giveaway is in
 * @property {?String} hostedBy The name of the user who created the giveaway
 * @property {?String} image The image of the giveaway
 * @property {?Boolean} isDrop If the giveaway should automatically end after the amout of reactions is the same as the winner amount (default: false)
 * @property {?GiveawayLastChanceData} lastChance The last chance options for the giveaway
 * @property {Snowflake} messageId The id of the message the giveaway is
 * @property {?GiveawayMessagesData} messages The messages of the giveaway
 * @property {?GiveawayPauseData} pauseOptions The pause options for the giveaway
 * @property {String} prize The prize of the giveaway
 * @property {EmojiIdentifierResolvable} reaction The reaction emoji of the giveaway (default: "🎉")
 * @property {Number} startAt The start date of the giveaway
 * @property {?String} thumbnail The thumbnail of the giveaway
 * @property {Array<Snowflake>} winnerIds The ids of the winners of the giveaway after it has ended
 * @property {Number} winners The amount of winners for this giveaway (default: 1)
 */

/**
 * @typedef {Object} GiveawayLastChanceData
 * @property {?ColorResolvable} embedColor The color of the embed while last chance is active (default: #fcb22d)
 * @property {?Boolean} enabled If last chance is enabled (default: false)
 * @property {?String} message The message of the last chance (default: "⚠ **Last Chance To Enter** ⚠")
 * @property {?Number} time The time in milliseconds before the giveaways ends when the last chance will be enabled (default: 30000)
 */

/**
 * @typedef {Object} GiveawayMessagesData
 * @property {?String} drawing The message displayed below #reactToParticipate (default: "Drawing: {timestamp}")
 * @property {?String} drop The message displayed in the giveaway embed displayed when the giveaway is a drop giveaway
 * @property {?String} endedAt The message displayed in the giveaway footer, next to the giveaway end date, when the givewaway has ended
 * @property {?EmbedFooterOptions} footer The footer of the giveaway embed
 * @property {?String} giveaway The message displayed above the giveaway embed when the giveaway is running (default: "🎉 **Giveaway** 🎉")
 * @property {?String} giveawayEnded The message displayed above the giveaway embed when the giveaway has ended (default: "🎉 **Giveaway Ended** 🎉")
 * @property {?String} hostedBy The message displayed in the giveaway embed below #reactToParticipate (default: "Hosted by: {this.hostedBy}")
 * @property {?String} noWinner The message displayed when there was no valid winner of the giveaway (default: "The giveaway was cancelled due to no valid participations.")
 * @property {?String} reactToParticipate The message displayed in the giveaway embed (default: "React with {this.reaction} to participate!")
 * @property {?String} title The title of the giveaway embed (default: "{this.price}")
 * @property {?String} winMessage The message displayed after the giveaway ended (default: "Congratulations, {winners}! You won **{this.prize}**!")
 * @property {?String} winners The message displayed in the giveaway embed before the winners (default: "Winner(s)")
 */

/**
 * @typedef {Object} GiveawayPauseData
 * @property {?Number} durationAfterPause The remaining duration of the giveaway after it has been unpaused. (This will be set automatically from the manager)
 * @property {?ColorResolvable} embedColor The color of the embed while the giveaway is paused (default: #fe6b61)
 * @property {?String} infiniteDurationText The text of the message when the giveaway is paused and #unpauseAfter is null (default: "NEVER")
 * @property {?Boolean} isPaused If the giveaway is paused (default: false)
 * @property {?String} message The message of the giveaway when it is paused (default: "ℹ **This Giveaway Is Paused** ℹ")
 * @property {?Number} unpauseAfter The number of milliseconds after the giveaway is unpaused (default: null)
 */

/**
 * @typedef {Object} GiveawayManagerOptions
 * @property {?Number} checkInterval The amount in milliseconds the giveaways should be checked (default: 15000)
 * @property {?Number} deleteAfter The amount in milliseconds the giveaways should be deleted after they ended (default: 2.592e8 [3 days])
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

        if(!options?.checkInterval || typeof options.checkInterval !== 'number') options.checkInterval = 15000;
        if(!options?.deleteAfter || typeof options.deleteAfter !== 'number') options.deleteAfter = 2.592e8;
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

        const rawGiveaways = await this._getGiveaways();

        rawGiveaways.forEach((giveaway) => this.cache.push(new Giveaway(this.client, this, giveaway)));

        setInterval(() => {
            if(this.client.readyAt) this._checkGiveaways.call(this);
        }, this.options.checkInterval);

        this.isReady = true;

        if(Number.isFinite(this.options.deleteAfter)) {

            const endedGiveaways = this.cache.filter((giveaway) => giveaway.ended && giveaway.endAt + this.options.deleteAfter <= Date.now());

            this.cache = this.cache.filter((giveaway) => !endedGiveaways.map((g) => g.messageId).includes(giveaway.messageId));

            for(const giveaway of endedGiveaways) await this.deleteGiveaway(giveaway);

        }

    }

    /**
     * Checks the giveaways and updates them if necessarily
     * @private
     */
    async _checkGiveaways() {

        if(this.cache.length < 1) return;

        this.cache.forEach(async (giveaway) => {

            if(giveaway.ended) {

                if(Number.isFinite(this.options.deleteAfter) && giveaway.endAt + this.options.deleteAfter <= Date.now()) {

                    this.cache = this.cache.filter((g) => g.messageId !== giveaway.messageId);

                    await this.save();

                }

                return;

            }

            if(giveaway.isDrop) {

                giveaway.message = await giveaway.fetchMessage().catch(() => {});

                if(giveaway.messageReaction?.count - 1 >= giveaway.winners) {

                    const giveawayUsers = await giveaway.fetchAllEntries().catch(() => {});

                    let validGiveawayUsers = 0;

                    for(const giveawayUser of [...(giveawayUsers?.values() || [])]) {

                        if(await giveaway.checkWinnerEntry(giveawayUser)) validGiveawayUsers++;
                        if(validGiveawayUsers === giveaway.winners) {

                            await this.end(giveaway).catch(() => {});

                            break;

                        }

                    }

                }

                if(giveaway.startAt + this.options.deleteAfter <= Date.now()) {

                    this.cache = this.cache.filter((g) => g.messageId !== giveaway.messageId);

                    await this.save();

                }

            }

            if(giveaway.pauseOptions.isPaused) {

                if(!Number.isFinite(giveaway.pauseOptions.durationAfterPause) && !Number.isFinite(giveaway.pauseOptions.unpauseAfter)) {

                    giveaway.data.pause.durationAfterPause = giveaway.remainingTime;
                    giveaway.data.endAt = Infinity;

                    await this.save();

                }

                if(Date.now() > giveaway.pauseOptions.unpauseAfter && Number.isFinite(giveaway.pauseOptions.unpauseAfter)) return this.unpause(giveaway).catch(() => {});

            }

            if(giveaway.remainingTime <= 0) return this.end(giveaway).catch(() => {});

            giveaway.ensureEndTimeout();

            if(giveaway.lastChance.enabled && giveaway.remainingTime - giveaway.lastChance.time < this.options.checkInterval) {

                setTimeout(async () => {

                    giveaway.message ??= await giveaway.fetchMessage().catch(() => {});

                    const giveawayEmbed = this._generateGiveawayEmbed(giveaway, { lastChance: true });

                    await giveaway.message
                        ?.edit({
                            allowedMentions: giveaway.allowedMentions,
                            content: giveaway._fillInString(giveaway.messages.giveaway),
                            embeds: [giveawayEmbed]
                        }).catch(() => {});
                    
                }, giveaway.remainingTime - giveaway.lastChance.time);

            }

            giveaway.message ??= await giveaway.fetchMessage().catch(() => {});

            if(!giveaway.message) return;
            if(!giveaway.message.embeds[0]) await giveaway.message.suppressEmbeds(false).catch(() => {});

            const updatedGiveawayEmbed = this._generateGiveawayEmbed(giveaway, { lastChance: giveaway.lastChance.enabled && giveaway.remainingTime < giveaway.lastChance.time });

            if((!Utils.equalEmbeds(giveaway.message.embeds[0].data, updatedGiveawayEmbed.data) || giveaway.message.content !== giveaway._fillInString(giveaway.messages.giveaway)) || this.options.checkInterval) {

                await giveaway.message
                    ?.edit({
                        allowedMentions: giveaway.allowedMentions,
                        content: giveaway._fillInString(giveaway.messages.giveaway),
                        embeds: [updatedGiveawayEmbed]
                    }).catch(() => {});

            }

        });

    }

    /**
     * Generates the giveaway embed
     * @param {Giveaway} giveaway 
     * @param {Object} options
     * @param {?Boolean} options.lastChance
     * @returns {EmbedBuilder}
     * @private
     */
    _generateGiveawayEmbed(giveaway, options = { lastChance: false }) {

        const giveawayEmbed = new EmbedBuilder()
            .setTitle(giveaway.messages.giveaway)
            .setColor(giveaway.isDrop ? giveaway.embedColor : giveaway.pauseOptions.isPaused && giveaway.pauseOptions.embedColor ? giveaway.pauseOptions.embedColor : options.lastChance ? giveaway.lastChance.embedColor : giveaway.embedColor)
            .setDescription(
                giveaway.isDrop ? giveaway.messages.drop : (giveaway.pauseOptions.isPaused ? giveaway.pauseOptions.message + '\n\n' : options.lastChance ? giveaway.lastChance.message + '\n\n' : '') + giveaway.messages.reactToParticipate + '\n' + giveaway.messages.drawing + giveaway.hostedBy
            )
            .setFooter({ iconURL: giveaway.messages.footer.iconURL, text: giveaway.messages.footer.text })
            .setImage(giveaway.image)
            .setThumbnail(giveaway.thumbnail);

        if (giveaway.endAt !== Infinity) giveawayEmbed.setTimestamp(giveaway.endAt);

        return giveaway._fillInEmbed(giveawayEmbed);

    }

    /**
     * Generates the giveaway end embed
     * @param {Giveaway} giveaway 
     * @param {Array<Snowflake>} winnerIds
     * @returns {EmbedBuilder}
     * @private
     */
    _generateGiveawayEndEmbed(giveaway, winnerIds) {

        const winners = winnerIds.map((winner) => `<@${w}>`).join(', ');
        const giveawayMessages = {
            endedAt: giveaway._fillInString(giveaway.messages.endedAt),
            hostedBy: giveaway._fillInString(giveaway.messages.hostedBy),
            title: giveaway._fillInString(giveaway.messages.title),
            winners: giveaway._fillInString(giveaway.messages.winners)
        };
        const giveawayMessagesDescription = (w) => giveawayMessages.winners + ' ' + giveawayMessages.hostedBy;

        for(let i = 1; giveawayMessagesDescription(winners).length > 4096 || giveawayMessages.title.length + giveawayMessages.endedAt.length + giveawayMessagesDescription(winners).length > 6000; i++) {

            winners = winners.slice(0, winners.lastIndexOf(', <@')) + `, ${i} more`;

        }

        const giveawayEndEmbed = new EmbedBuilder()
            .setTitle(giveawayMessages.title)
            .setColor(giveaway.embedColorEnded)
            .setDescription(giveawayMessagesDescription(winners))
            .setFooter({ iconURL: giveaway.messages.footer.iconURL, text: giveawayMessages.endedAt })
            .setImage(giveaway.image)
            .setThumbnail(giveaway.thumbnail)
            .setTimestamp(givaway.endAt)

        return giveawayEndEmbed;
    }

    /**
     * Generates the givaway no valid participations embed
     * @param {Giveaway} giveaway
     * @returns {EmbedBuilder}
     * @private
     */
    _generateGiveawayNoValidParticipationsEmbed(giveaway) {

        const giveawayNoValidParticipationsEmbed = new EmbedBuilder()
            .setTitle(giveaway.messages.title)
            .setColor(giveaway.embedColorEnded)
            .setDescription(giveaway.messages.noWinner + '\n' + giveaway._fillInString(giveaway.messages.hostedBy))
            .setFooter({ iconURL: giveaway.messages.footer.iconURL, text: giveaway.messages.endedAt })
            .setImage(giveaway.image)
            .setThumbnail(giveaway.thumbnail)
            .setTimestamp(givaway.endAt)

        return giveaway._fillInEmbed(giveawayNoValidParticipationsEmbed);

    }

    /**
     * Gets the raw giveaway data from the json file
     * @returns {Array<GiveawayData>|DisGroupDevError}
     * @private
     */
    async _getGiveaways() {

        const storage = FileSystem.existsSync(this.options.storage);

        if(!storage) {

            await FileSystem.writeFileSync(this.options.storage, JSON.stringify(new Array(), null, 4), { encoding: 'utf-8' });

            return new Array();

        } else {

            const storageContent = FileSystem.readFileSync(this.options.storage, { encoding: 'utf-8' });

            try {

                const giveawayArray = await JSON.parse(storageContent.toString());

                if(Array.isArray(giveawayArray)) {

                    return giveawayArray;

                } else {

                    throw new DisGroupDevError(Messages.INVALID_JSON);

                }

            } catch(e) {

                throw new DisGroupDevError(e);

            }

        }

    }

    /**
     * @typedef {Object} GiveawayStartOptions
     * @property {?MessageMentionOptions} allowedMentions The allowed mentions in the giveaway message
     * @property {?Boolean} botsCanWin If bots can win the giveaway (default: false)
     * @property {Number} duration The duration of the giveaway in milliseconds (default: 900000)
     * @property {?ColorResolvable} embedColor The color of the embed (default: #3496eb)
     * @property {?ColorResolvable} embedColorEnded The color of the embed when the giveaway has ended (default: #ffde22)
     * @property {Array<Snowflake>} exceptMembers The ids of the members who can't win the giveaway (default: [])
     * @property {Array<PermissionFlagsBits>} exceptPermissions The permissions for the user to not be able to win the giveaway (default: [])
     * @property {?String} hostedBy The name of the user who created the giveaway
     * @property {?String} image The image of the giveaway
     * @property {?Boolean} isDrop If the giveaway should automatically end after the amout of reactions is the same as the winner amount (default: false)
     * @property {?GiveawayLastChanceData} lastChance The last chance options for the giveaway
     * @property {?GiveawayMessagesData} messages The messages of the giveaway
     * @property {?GiveawayPauseData} pause The pause options for the giveaway
     * @property {String} prize The prize of the giveaway
     * @property {EmojiIdentifierResolvable} reaction The reaction emoji of the giveaway (default: "🎉")
     * @property {?String} thumbnail The thumbnail of the giveaway
     * @property {Number} winners The amount of winners for this giveaway (default: 1)
     */

    /**
     * Starts a giveaway in a text channel
     * @param {BaseGuildTextChannel} channel
     * @param {User} user
     * @param {GiveawayStartOptions} options
     * @returns {Promise<Giveaway|DisGroupDevError>|DisGroupDevError}
     * @public 
     */
    createGiveaway(channel, user, options) {

        if(!this.isReady) throw new DisGroupDevError(Messages.NOT_READY);

        return new Promise(async (resolve, reject) => {

            if(!channel || !channel.isTextBased()) reject(new DisGroupDevError(Messages.GIVEAWAY_INVALID_CHANNEL));
            if(!user || !user instanceof User) reject(new DisGroupDevError(Messages.GIVEAWAY_INVALID_USER));
            if(!options || typeof options !== 'object') reject(new DisGroupDevError(Messages.GIVEAWAY_INVALID_START_OPTIONS));

            if(!options.isDrop && ( typeof options.duration !== 'number' || options.duration < 1)) options.duration = 900000;
            if(options.isDrop && typeof options.isDrop !== 'boolean') options.isDrop = false;
            if(typeof options.duration !== 'number') reject(new DisGroupDevError(Messages.NOT_A_NUMBER(options.duration)));
            if(typeof options.isDrop !== 'boolean') reject(new DisGroupDevError(Messages.NOT_A_BOOLEAN(options.isDrop)));
            if(!options.prize || typeof options.prize !== 'string') reject(new DisGroupDevError(Messages.NOT_A_STRING(options.prize)));
            if(!options.winners || options.winners < 1) options.winners = 1;
            if(typeof options.winners !== 'number') reject(new DisGroupDevError(Messages.NOT_A_NUMBER(options.winners)));

            const giveaway = new Giveaway(this.client, this, {
                allowedMentions: options.allowedMentions,
                botsCanWin: options.botsCanWin,
                channelId: channel.id,
                embedColor: options.embedColor,
                embedColorEnded: options.embedColorEnded,
                endAt: options.isDrop ? Infinity : Date.now() + options.duration,
                exceptMembers: options.exceptMembers,
                exceptPermissions: options.exceptPermissions,
                guildId: channel.guildId,
                hostedBy: options.hostedBy ?? user.username,
                image: options.image,
                isDrop: options.isDrop,
                lastChance: {
                    embedColor: options.lastChance.embedColor,
                    enabled: options.lastChance.enabled,
                    message: options.lastChance.message,
                    time: options.lastChance.time,
                },
                messages: {
                    drawing: options.messages.drawing,
                    drop: options.messages.drop,
                    endedAt: options.messages.endedAt,
                    footer: options.messages.footer,
                    giveaway: options.messages.giveaway,
                    giveawayEnded: options.messages.giveawayEnded,
                    hostedBy: options.messages.hostedBy,
                    noWinner: options.messages.noWinner,
                    reactToParticipate: options.messages.reactToParticipate,
                    title: options.messages.title,
                    winMessage: options.messages.winMessageize,
                    winners: options.messages.winners
                },
                pauseOptions: {
                    durationAfterPause: options.pause.durationAfterPause,
                    embedColor: options.pause.embedColor,
                    infiniteDurationText: options.pause.infiniteDurationText,
                    isPaused: options.pause.isPaused,
                    message: options.pause.message,
                    unpauseAfter: options.pause.unpauseAfter
                },
                prize: options.prize,
                reaction: options.reaction,
                startAt: Date.now(),
                thumbnail: options.thumbnail,
                winners: options.winners 
            });

            try {

                const giveawayEmbed = this._generateGiveawayEmbed(giveaway);
                const giveawayMessage = await channel.send({
                    allowedMentions: giveaway.allowedMentions,
                    content: giveaway._fillInString(giveaway.messages.giveaway),
                    embeds: [giveawayEmbed]
                });
                const giveawayReaction = await giveawayMessage.react(giveaway.reaction);

                giveaway.message = giveawayReaction.message;
                this.cache.push(giveaway);

                await this.save();

                /**
                 * Emitted when a giveaway is created
                 * @event GiveawayManager#giveawayCreate
                 * @param {Giveaway} giveaway
                 */
                this.emit('giveawayCreate', giveaway);

                resolve(giveaway);

                if(giveaway.isDrop) {

                    giveaway.message.awaitReactions({
                        filter: async (reaction, user) => [reaction.emoji.id, reaction.emoji.name].filter(Boolean).includes(giveawayReaction.emoji.id ?? giveawayReaction.emoji.name) && user.id !== this.client.user.id && (await giveaway.checkWinnerEntry(user)),
                        maxUsers: giveaway.winners
                    })
                    .then(() => this.endGiveaway(giveaway))
                    .catch((e) => reject(new DisGroupDevError(e)));

                }


            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Deletes a givaway
     * @param {Giveaway} giveaway 
     * @returns {Promise<Giveaway>|DisGroupDevError}
     * @public
     */
    deleteGiveaway(giveaway) {

        if(!this.isReady) throw new DisGroupDevError(Messages.NOT_READY);
        if(!giveaway instanceof Giveaway) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(giveaway, Giveaway));

        return new Promise(async (resolve, reject) => {

            this.cache = this.cache.filter((g) => g.messageId !== giveaway.messageId);

            await this.save();

            /**
             * Emitted when a giveaway gets deleted
             * @event GiveawayManager#giveawayDelete
             * @param {Giveaway} giveaway
             */
            this.emit('giveawayDelete', giveaway);

            resolve(giveaway);

        });

    }

    /**
     * @typedef {Object} GiveawayEditData
     * @property {?Number} addTime The amount of milliseconds added to the duration of the giveaway
     * @property {?Array<Snowflake>} exceptMembers An array with the ids of the members who are unable to participate in the giveaway
     * @property {?Array<PermissionFlagsBits>} exceptPermissions An array with the permission who are unable to paritipate in the giveaway
     * @property {?String} image The image of the giveaway
     * @property {?GiveawayLastChanceData} lastChance The last chance data of the giveaway
     * @property {?GiveawayMessagesData} messages The messages of the giveaway
     * @property {?String} prize The prize of the giveaway
     * @property {?String} thumbnail The thumbnail of the giveaway
     * @property {?String} timestamp The new end timestamp of the giveaway
     * @property {?Number} winners The amount of winners drawn for the giveaway
     */

    /**
     * Edits a giveaway
     * @param {Giveaway} giveaway 
     * @param {GiveawayEditData} data
     * @returns {Promise<Giveaway|DisGroupDevError>|DisGroupDevError}
     */
    editGiveaway(giveaway, data = {}) {

        if(!this.isReady) throw new DisGroupDevError(Messages.NOT_READY);
        if(!giveaway instanceof Giveaway) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(giveaway, Giveaway));

        return new Promise(async (resolve, reject) => {

            if(giveaway.ended) reject(new DisGroupDevError(Messages.GIVEAWAY_ALREADY_ENDED));

            giveaway.message ??= await giveaway.fetchMessage().catch((e) => reject(new DisGroupDevError(e)));

            if(!giveaway.message) reject(new DisGroupDevError(Messages.GIVEAWAY_INVALID_MESSAGE(giveaway.messageId)));

            if(data.addTime && typeof data.addTime === 'number' && !giveaway.isDrop) {
                giveaway.data.endAt = giveaway.data.endAt + data.addTime;
                if(giveaway.endTimeout) clearTimeout(giveaway.endTimeout);
                giveaway.ensureEndTimeout();
            }
            if(data.exceptMembers && Array.isArray(data.exceptMembers)) giveaway.data.exceptMembers = data.exceptMembers;
            if(data.exceptPermissions && Array.isArray(data.exceptPermissions)) giveaway.data.exceptPermissions = data.exceptPermissions;
            if(data.image && typeof data.image === 'string') giveaway.data.image = data.image;
            if(data.lastChance && typeof data.lastChance === 'object' && !giveaway.isDrop) {
                giveaway.data.lastChance = {
                    embedColor: data.lastChance.embedColor ?? giveaway.lastChance.embedColor,
                    enabled: data.lastChance.enabled ?? giveaway.lastChance.enabled,
                    message: data.lastChance.message ?? giveaway.lastChance.message,
                    time: data.lastChance.time ?? giveaway.lastChance.time
                }
            }
            if(data.messages && typeof data.messages === 'object') {
                giveaway.data.messages = {
                    drawing: data.messages.drawing ?? giveaway.messages.drawing,
                    drop: data.messages.drop ?? giveaway.messages.drop,
                    endedAt: data.messages.endedAt ?? giveaway.messages.endedAt,
                    footer: data.messages.footer ?? giveaway.messages.footer,
                    giveaway: data.messages.giveaway ?? giveaway.messages.giveaway,
                    giveawayEnded: data.messages.giveawayEnded ?? giveaway.messages.giveawayEnded,
                    hostedBy: data.messages.hostedBy ?? giveaway.messages.hostedBy,
                    noWinner: data.messages.noWinner ?? giveaway.messages.noWinner,
                    reactToParticipate: data.messages.reactToParticipate ?? giveaway.messages.reactToParticipate,
                    title: data.messages.title ?? giveaway.messages.title,
                    winMessage: data.messages.winMessage ?? giveaway.messages.winMessage,
                    winners: data.messages.winners ?? giveaway.messages.winners
                }
            }
            if(data.prize && typeof data.prize === 'string') giveaway.data.prize = data.prize;
            if(data.thumbnail && typeof data.thumbnail === 'string') giveaway.data.thumbnail = data.thumbnail;
            if(data.timestamp && typeof data.timestamp === 'number' && !giveaway.isDrop) giveaway.data.endAt = data.timestamp;
            if(data.winners && typeof data.winners === 'number' && data.winners > 0 && !giveaway.isDrop) giveaway.data.winners = data.winners;

            await this.save();
            
            if(giveaway.remainingTime <= 0) {

                this.endGiveaway(giveaway);

            } else {

                const giveawayEmbed = this._generateGiveawayEmbed(giveaway);

                await giveaway.message.edit({
                    allowedMentions: giveaway.allowedMentions,
                    content: giveaway._fillInString(giveaway.messages.giveaway),
                    embeds: [giveawayEmbed]
                }).catch((e) => reject(new DisGroupDevError(e)));

            }

            /**
             * Emitted when a giveaway gets updated
             * @event GiveawayManager#giveawayUpdate
             * @param {Giveaway} giveaway
             */
            this.emit('giveawayUpdate', giveaway);

            resolve(giveaway);

        });

    }

    /**
     * Ends a giveaway
     * @param {Giveaway} giveaway
     * @returns {Promise<Giveaway|DisGroupDevError>|DisGroupDevError}
     * @public
     */
    endGiveaway(giveaway) {

        if(!this.isReady) throw new DisGroupDevError(Messages.NOT_READY);
        if(!giveaway instanceof Giveaway) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(giveaway, Giveaway));

        return new Promise(async (resolve, reject) => {
        
            if(giveaway.ended) reject(new DisGroupDevError(Messages.GIVEAWAY_ALREADY_ENDED));

            giveaway.ended = true;
            giveaway.message = await giveaway.fetchMessage().catch((e) => reject(new DisGroupDevError(e)));

            if(!giveaway.message) return;
            if(giveaway.endAt < this.client.readyTimestamp || !giveaway.isDrop || this.options.pauseOptions.isPaused) giveaway.data.endAt(Date.now());
            if(giveaway.pauseOptions.isPaused) giveaway.data.pauseOptions.isPaused = false;

            await this.save();

            const giveawayWinners = await this.rollGiveaway(giveaway);
            
            if(giveawayWinners.length > 0) {

                giveaway.data.winnerIds = giveawayWinners.map((w) => w.id);

                await this.save();

                const giveawayEndedEmbed = await this._generateGiveawayEndEmbed(giveaway, giveaway.winnerIds);

                await giveaway.message.edit({
                    allowedMentions: giveaway.allowedMentions,
                    content: giveaway._fillInString(giveaway.messages.giveawayEnded),
                    embeds: [giveawayEndedEmbed]
                }).catch((e) => reject(new DisGroupDevError(e)));

                let formattedGiveawayWinners = giveawayWinners.map((w) => `<@${w.id}>`).join(', ');
                const giveawayWinnerMessage = giveaway._fillInString(giveaway.messages.winMessage)
                const giveawayMessage = giveawayWinnerMessage.replace('{winners}', formattedGiveawayWinners);
                
                if(giveawayMessage.length > 2000) {

                    const giveawayWinnerMessageFirstPart = giveawayWinnerMessage.slice(0, giveawayWinnerMessage.indexOf('{winners}'));

                    if(giveawayWinnerMessageFirstPart.length > 0) {

                        giveaway.message.channel.send({
                            allowedMentions: giveaway.allowedMentions,
                            content: giveawayWinnerMessageFirstPart,
                            reply: {
                                failIfNotExists: false,
                                messageReference: giveaway.messageId
                            }
                        });

                    }

                    while(formattedGiveawayWinners.length >= 2000) {

                        await giveaway.message.channel.send({ allowedMentions: giveaway.allowedMentions, content: formattedGiveawayWinners.slice(0, formattedGiveawayWinners.lastIndexOf(',', 1999)) + ',' });

                        formattedGiveawayWinners = formattedGiveawayWinners.slice(formattedGiveawayWinners.slice(0, formattedGiveawayWinners.lastIndexOf(',', 1999) + 2).length);

                        giveaway.message.channel.send({ allowedMentions: giveaway.allowedMentions, content: formattedGiveawayWinners });


                    }

                    const giveawayWinnerMessageLastPart = giveawayWinnerMessage.slice(giveawayWinnerMessage.indexOf('{winners}') + 9);

                    if(giveawayWinnerMessageLastPart.length > 0) {

                        giveaway.message.channel.send({
                            allowedMentions: giveaway.allowedMentions,
                            content: giveawayWinnerMessageLastPart
                        });

                    }

                } else if(giveawayMessage.length <= 2000) {

                    giveaway.message.channel.send({
                        allowedMentions: giveaway.allowedMentions,
                        content: giveawayMessage,
                        reply: {
                            failIfNotExists: false,
                            messageReference: giveaway.messageId
                        }
                    });

                }

            } else {

                await giveaway.message.edit({
                    allowedMentions: giveaway.allowedMentions,
                    content: giveaway._fillInString(giveaway.messages.giveawayEnded),
                    embed: [this._generateGiveawayNoValidParticipationsEmbed(giveaway)]
                }).catch((e) => reject(new DisGroupDevError(e)));

            }

            /**
             * Emitted when a giveaway has ended
             * @event GiveawayManager#giveawayEnd
             * @param {Giveaway} giveaway
             */
            this.emit('giveawayEnd', giveaway);

            resolve(giveaway);

        });

    }

    /**
     * Handles the "messageReactionAdd" event
     * @param {MessageReaction} reaction 
     * @param {User} user
     * @public 
     */
    async handleMessageReactionAdd(reaction, user) {

        if(!reaction || !reaction instanceof MessageReaction) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(reaction, MessageReaction));
        if(!user || !user instanceof User) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(user, User));

        const giveaway = this.cache.find((g) => g.messageId === reaction.message.id);

        if(!giveaway) return;
        
        const giveawayEmoji = resolvePartialEmoji(giveaway.reaction);
        
        if((reaction.emoji.name !== giveawayEmoji.name) || (reaction.emoji.id !== giveawayEmoji.id)) return;

        /**
         * Emitted when a user adds a reaction form a giveaway
         * @event GiveawayManager#giveawayReactionAdd
         * @param {Giveaway} giveaway
         * @param {MessageReaction} reaction
         * @param {User} user
         */
        this.emit('giveawayReactionAdd', giveaway, reaction, user);

        if(giveaway.isDrop && reaction.cound - 1 >= giveaway.winners) {

            const giveawayUsers = await giveaway.fetchAllEntries().catch(() => {});

            let validGiveawayUsers = 0;

            for(const giveawayUser of [...(giveawayUsers?.values() || [])]) {

                if(await giveaway.checkWinnerEntry(giveawayUser)) validGiveawayUsers++;
                if(validGiveawayUsers === giveaway.winners) {

                    await this.end(giveaway).catch(() => {});

                    break;

                }

            }

        }

    }

    /**
     * Handles the "messageReactionRemove" event
     * @param {MessageReaction} reaction 
     * @param {User} user
     * @public
     */
    async handleMessageReactionRemove(reaction, user) {

        if(!reaction || !reaction instanceof MessageReaction) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(reaction, MessageReaction));
        if(!user || !user instanceof User) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(user, User));

        const giveaway = this.cache.find((g) => g.messageId === reaction.message.id);

        if(!giveaway || giveaway.ended) return;

        /**
         * Emitted when a user removes a reaction form a giveaway
         * @event GiveawayManager#giveawayReactionRemove
         * @param {Giveaway} giveaway
         * @param {MessageReaction} reaction
         * @param {User} user
         */
        this.emit('giveawayReactionRemove', giveaway, reaction, user);

    }

    pauseGiveaway(giveaway, options) {

        

    }

    /**
     * @typedef {Object} GiveawayRerollOptions
     * @property {Object} messages The messages for the reroll
     * @property {?String} messages.noWinner The new no winner message (default: "The giveaway was cancelled due to no valid participations.")
     * @property {?String} messages.winMessage The new win message (default: "New winner(s): {winners}! Congratulations, you won **{this.prize}**!")
     * @property {?Number} winners The amount of winners for the giveaway (default: 1)
     */

    /**
     * Rerolls a giveaway
     * @param {Giveaway} giveaway 
     * @param {GiveawayRerollOptions} options
     * @returns {Promise<Array<GuildMember>>}
     * @public
     */
    rerollGiveaway(giveaway, options) {

        if(!this.isReady) throw new DisGroupDevError(Messages.NOT_READY);
        if(!giveaway instanceof Giveaway) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(giveaway, Giveaway));

        return new Promise(async (resolve, reject) => {

            options = {
                messages = {
                    noWinner: typeof options.messages.noWinner === 'string' ? options.messages.noWinner : "The giveaway was cancelled due to no valid participations.",
                    winMessage: typeof options.messages.winMessage === 'string' ? options.messages.winMessage : "New winner(s): {winners}! Congratulations, you won **{this.prize}**!"
                },
                winners: typeof options.winners === 'number' ? options.winners : 1
            };

            if(!giveaway.ended) reject(new DisGroupDevError(Messages.GIVEAWAY_STILL_RUNNING(giveaway.messageId)));

            giveaway.message ??= await giveaway.fetchMessage().catch(() => {});

            if(!giveaway.message) reject(new DisGroupDevError(Mesasges.GIVEAWAY_INVALID_MESSAGE(giveaway.messageId)));
            if(giveaway.isDrop) resolve([]);

            giveaway.data.winners = options.winners;
            giveaway.data.messages.noWinner = options.messages.noWinner;
            giveaway.data.messages.winMessage = options.messages.winMessage;

            await this.save();

            const giveawayWinners = await this.rollGiveaway(giveaway);
            
            if(giveawayWinners.length > 0) {

                giveaway.data.winnerIds = giveawayWinners.map((w) => w.id);

                await this.save();

                const giveawayEndedEmbed = await this._generateGiveawayEndEmbed(giveaway, giveaway.winnerIds);

                await giveaway.message.edit({
                    allowedMentions: giveaway.allowedMentions,
                    content: giveaway._fillInString(giveaway.messages.giveawayEnded),
                    embeds: [giveawayEndedEmbed]
                }).catch((e) => reject(new DisGroupDevError(e)));

                let formattedGiveawayWinners = giveawayWinners.map((w) => `<@${w.id}>`).join(', ');
                const giveawayWinnerMessage = giveaway._fillInString(giveaway.messages.winMessage)
                const giveawayMessage = giveawayWinnerMessage.replace('{winners}', formattedGiveawayWinners);
                
                if(giveawayMessage.length > 2000) {

                    const giveawayWinnerMessageFirstPart = giveawayWinnerMessage.slice(0, giveawayWinnerMessage.indexOf('{winners}'));

                    if(giveawayWinnerMessageFirstPart.length > 0) {

                        giveaway.message.channel.send({
                            allowedMentions: giveaway.allowedMentions,
                            content: giveawayWinnerMessageFirstPart,
                            reply: {
                                failIfNotExists: false,
                                messageReference: giveaway.messageId
                            }
                        });

                    }

                    while(formattedGiveawayWinners.length >= 2000) {

                        await giveaway.message.channel.send({ allowedMentions: giveaway.allowedMentions, content: formattedGiveawayWinners.slice(0, formattedGiveawayWinners.lastIndexOf(',', 1999)) + ',' });

                        formattedGiveawayWinners = formattedGiveawayWinners.slice(formattedGiveawayWinners.slice(0, formattedGiveawayWinners.lastIndexOf(',', 1999) + 2).length);

                        giveaway.message.channel.send({ allowedMentions: giveaway.allowedMentions, content: formattedGiveawayWinners });


                    }

                    const giveawayWinnerMessageLastPart = giveawayWinnerMessage.slice(giveawayWinnerMessage.indexOf('{winners}') + 9);

                    if(giveawayWinnerMessageLastPart.length > 0) {

                        giveaway.message.channel.send({
                            allowedMentions: giveaway.allowedMentions,
                            content: giveawayWinnerMessageLastPart
                        });

                    }

                } else if(giveawayMessage.length <= 2000) {

                    giveaway.message.channel.send({
                        allowedMentions: giveaway.allowedMentions,
                        content: giveawayMessage,
                        reply: {
                            failIfNotExists: false,
                            messageReference: giveaway.messageId
                        }
                    });

                }

            } else {

                await giveaway.message.edit({
                    allowedMentions: giveaway.allowedMentions,
                    content: giveaway._fillInString(giveaway.messages.giveawayEnded),
                    embed: [this._generateGiveawayNoValidParticipationsEmbed(giveaway)]
                }).catch((e) => reject(new DisGroupDevError(e)));

            }

            /**
             * Emitted when a giveaway has been rerolled
             * @event GiveawayManager#giveawayReroll
             * @param {Giveaway} giveaway
             */
            this.emit('giveawayReroll', giveaway);

            resolve([]);

        });

    }

    /**
     * Rolls a giveaway
     * @param {Giveaway} giveaway
     * @returns {Promise<Array<GuildMember>>}
     * @public
     */
    rollGiveaway(giveaway) {

        if(!this.isReady) throw new DisGroupDevError(Messages.NOT_READY);
        if(!giveaway instanceof Giveaway) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(giveaway, Giveaway));

        return new Promise(async (resolve, reject) => {

            let giveawayGuild = await this.client.guilds.fetch(giveaway.guildId).catch((e) => reject(new DisGroupDevError(e))) ?? giveaway.message.guild;

            giveaway.message = await giveaway.fetchMessage().catch((e) => reject(new DisGroupDevError(e))) ?? giveaway.message;

            await giveawayGuild.members.fetch().catch((e) => reject(new DisGroupDevError(e)));

            const giveawayUsers = await giveaway.fetchAllEntries().catch((e) => reject(new DisGroupDevError(e)));

            if(!giveawayUsers?.size) resolve(new Array());

            const giveawayRandomUsers = (amount) => {

                if(!giveawayUsers || giveawayUsers.length <= amount) return giveawayUsers.random(amount);

                return Array.from({ length: Math.min(amount, giveawayUsers.size) }, () => giveawayUsers.splice(Math.floor(Math.random() * giveawayUsers.length), 1)[0]);

            };

            const giveawayWinners = new Array();

            for(const user of giveawayRandomUsers(giveaway.winners)) {

                const userValidEntry = !giveawayWinners.some((winner) => await winner.id === user.id) && (await giveaway.checkWinnerEntry(user));

                if(userValidEntry) {

                    giveawayWinners.push(user)

                } else {

                    for(let i = 0; i < giveawayUsers.size; i++) {

                        const giveawayUser = giveawayRandomUsers(1)[0];
                        const giveawayUserValidEntry = !giveawayWinners.some((winner) => await winner.id === giveawayUser.id) && (await giveaway.checkWinnerEntry(giveawayUser));

                        if(giveawayUserValidEntry) {

                            giveawayWinners.push(giveawayUser);

                            break;

                        }

                        giveawayUsers.delete(giveawayUser.id);

                    }

                }

            }

            const finalGiveawayWinners = giveawayWinners.map(async (winner) => await giveawayGuild.members.fetch(winner.id).catch((e) => reject(new DisGroupDevError(e))));

            /**
             * Emitted when a giveaway gets rolled
             * @event GiveawayManager#giveawayRoll
             * @param {Giveaway} giveaway
             * @param {Array<GuildMember>} finalGiveawayWinners
             */
            this.emit('giveawayRoll', giveaway, finalGiveawayWinners);

            resolve(finalGiveawayWinners);

        });

    }

    /**
     * Saves the giveaways to the json file
     * @returns {Boolean|DisGroupDevError}
     * @public
     */
    async save() {

        try {

            await FileSystem.writeFileSync(this.options.storage, JSON.stringify(this.cache.map((giveaway) => giveaway.data), null, 4), { encoding: 'utf-8' });

            return true;

        } catch(e) {

            throw new DisGroupDevError(e);

        }

    }

}

module.exports = GiveawayManager;
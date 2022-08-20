const { Client, ColorResolvable, EmojiResolvable, MessageMentionOptions, MessageReaction, Snowflake, User, resolvePartialEmoji } = require('discord.js');
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
 * @property {?GiveawayPauseData} pause The pause options for the giveaway
 * @property {String} prize The prize of the giveaway
 * @property {EmojiResolvable|String} reaction The reaction emoji of the giveaway (default: "🎉")
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
 * @property {?String} dropMessage The message displayed in the giveaway embed displayed when the giveaway is a drop giveaway
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

            if(giveaway.pause.isPaused) {

                if(!Number.isFinite(giveaway.pause.durationAfterPause) && !Number.isFinite(giveaway.pause.unpauseAfter)) {

                    giveaway.data.pause.durationAfterPause = giveaway.remainingTime;
                    giveaway.data.endAt = Infinity;

                    await this.save();

                }

                if(Date.now() > giveaway.pause.unpauseAfter && Number.isFinite(giveaway.pause.unpauseAfter)) return this.unpause(giveaway).catch(() => {});

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
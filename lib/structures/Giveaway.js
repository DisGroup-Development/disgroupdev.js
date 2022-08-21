const { Client, Collection, ColorResolvable, EmojiIdentifierResolvable, Message, MessageMentionOptions, MessageReaction, Snowflake, User, resolveColor, resolvePartialEmoji } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const { ActionRowBuilder, EmbedBuilder, EmbedFooterOptions, messageLink } = require('@discordjs/builders');

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
 * The Giveaway class
 * @class
 */
class Giveaway {

    /**
     * The constructor of the Giveaway class
     * @param {Client} client 
     * @param {GiveawayManager} manager 
     * @param {GiveawayData} data
     */
    constructor(client, manager, data) {

        /**
         * The client
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The end timeout for this giveaway
         * @type {Function|null}
         * @private
         */
        this.endTimeout = null;

        /**
         * The manager of the giveaway
         * @type {GiveawayManager}
         * @public
         */
        this.manager = manager;

        /**
         * The message of the giveaway
         * @type {Message|null}
         * @public
         */
        this.message = null;

        /**
         * The raw data of the giveaway
         * @type {GiveawayData}
         * @private
         */
        this.data = data;

    }

    /**
     * Fills in an action row with the properties of the giveaway
     * @param {Array<ActionRowBuilder>} com 
     * @returns {Array<ActionRowBuilder>}
     * @private
     */
    _fillInComponent(com) {

        if(!Array.isArray(com)) return null;

        com = com.map((act) => {

            act = new ActionRowBuilder(act);

            act.components = act.components.map((c) => {

                c.data.custom_id &&= this._fillInString(c.data.custom_id);
                c.data.label &&= this._fillInString(c.data.label);
                c.data.url &&= this._fillInString(c.data.url);
                c.data.placeholder &&= this._fillInString(c.data.placeholder);
                c.data.options &&= c.data.options.map((opt) => {

                    opt.description &&= this._fillInString(opt.description);
                    opt.label = this._fillInString(opt.label);
                    opt.value = this._fillInString(opt.value);

                    return opt;

                });

                return c;

            });

            return act;

        });

        return com;

    }

    /**
     * Fills in an embed with the properties of the giveaway
     * @param {EmbedBuilder} emb 
     * @returns {EmbedBuilder}
     * @private
     */
    _fillInEmbed(emb) {

        if(!emb instanceof EmbedBuilder) return null;

        emb = new EmbedBuilder(emb)
            .setTitle(this._fillInString(emb.data.title))
            .setDescription(this._fillInString(emb.data.description));

        if(typeof emb.data.author?.name === 'string') emb.data.author.name = this._fillInString(emb.data.author.name);
        if(typeof emb.data.footer?.text === 'string') emb.data.footer.text = this._fillInString(emb.data.footer.text);
        if(embed.data.fields?.length && embed.data.fields?.length > 0) {
            emb.spliceFields(
                0,
                emb.data.fields.length,
                ...emb.data.fields.map((field) => {
                    field.name = this._fillInString(field.name);
                    field.value = this._fillInString(field.value);
                    return field;
                })
            );
        }

        return emb;

    }

    /** 
     * Fills in a string with the properties of the giveaway
     * @param {String} str
     * @returns {String}
     * @private
     */
    _fillInString(str) {

        if(typeof str !== 'string') return null;

        [...new Set(str.match(/\{[^{}]{1,}\}/g))]
            .filter((match) => match?.slice(1, -1).trim() !== '')
            .forEach((match) => {

                let rep;

                try {

                    rep = eval(match.slice(1, -1));

                } catch {

                    rep = match;

                }

            });

        return str.trim();

    }

    /**
     * The allowed mentions in the giveaway message
     * @returns {MessageMentionOptions|null}
     * @public
     */
    get allowedMentions() {

        return this.data.allowedMentions ?? null;

    }

    /**
     * If bots can win the giveaway
     * @returns {Boolean}
     * @public
     */
    get botsCanWin() {

        return this.data.botsCanWin ?? false;

    }

    /**
     * The id of the channel the giveaway is in
     * @returns {Snowflake|null}
     * @public
     */
    get channelId() {

        return this.data.channelId ?? null;

    }

    /**
     * Checks if a user is able to participate in the giveaway
     * @param {User} user 
     * @returns {Promise<Boolean>}
     * @public
     */
    checkWinnerEntry(user) {

        return new Promise(async (resolve) => {

            if(this.winnerIds.includes(user.id) || this.exceptMembers.includes(user.id)) resolve(false);

            const member = await this.message?.guild.members.fetch(user.id).catch(() => {});

            if(!member) resolve(false);

            const memberHasPermissions = this.exceptPermissions.some((permission) => member.permissions.has(permission));

            if(memberHasPermissions) resolve(false);

            resolve(true);

        });

    }

    /**
     * Deletes the giveaway
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    delete() {

        return this.manager.deleteGiveaway(this);

    }

    /**
     * The duration of the giveaway
     * @returns {Number}
     * @public
     */
    get duration() {

        return this.endAt - this.startAt;

    }

    /**
     * @typedef {Object} GiveawayEditData
     * @property {?Number} addTime The amount of milliseconds added to the duration of the giveaway
     * @property {?Array<Snowflake>} exceptMembers An array with the ids of the members who are unable to participate in the giveaway
     * @property {?String} image The image of the giveaway
     * @property {?GiveawayLastChanceData} lastChance The last chance data of the giveaway
     * @property {?GiveawayMessagesData} messages The messages of the giveaway
     * @property {?String} prize The prize of the giveaway
     * @property {?String} thumbnail The thumbnail of the giveaway
     * @property {?String} timestamp The new end timestamp of the giveaway
     * @property {?Number} winners The amount of winners drawn for the giveaway
     */

    /**
     * Edits the giveaway
     * @param {GiveawayEditData} data 
     * @returns {Promise<Giveaway>}
     * @public
     */
    edit(data = {}) {

        return this.manager.editGiveaway(this, data);

    } 

    /**
     * The color of the embed
     * @returns {Number}
     * @public
     */
    get embedColor() {

        return this.data.embedColor ?? resolveColor('#3496eb');

    }

    /**
     * The color of the embed when the giveaway has ended
     * @returns {Number}
     * @public
     */
    get embedColorEnded() {

        return this.data.embedColorEnded ?? resolveColor('#ffde22');

    }

    /**
     * Ends the giveaway
     * @returns {Promise<Array<User>>}
     * @public
     */
    end() {

        return this.manager.endGiveaway(this);

    }

    /**
     * The end date of the giveaway
     * @returns {Number}
     * @public
     */
    get endAt() {

        return this.data.endAt ?? Infinity;

    }

    /**
     * If the giveaway has ended
     * @returns {Boolean}
     * @public
     */
    get ended() {

        return this.data.ended ?? false;

    }

    /**
     * Ensure the end timeout for this giveaway is created
     * @returns {Function|null}
     * @private
     */
    ensureEndTimeout() {

        if(this.endTimeout) return;
        if(this.remainingTime > this.manager.options.checkInterval) return;

        this.endTimeout = setTimeout(() => this.manager.endGiveaway.call(this.manager, this.messageId, this.messages.noWinner).catch(() => {}), this.remainingTime);

        return this.endTimeout;

    }

    /**
     * The ids of the members who can't win the giveaway
     * @returns {Array<Snowflake>}
     * @public
     */
    get exceptMembers() {

        return this.data.exceptMembers ?? [];

    }

    /**
     * The permissions for the user to not be able to win the giveaway
     * @returns {Array<PermissionFlagsBits>}
     * @public
     */
    get exceptPermissions() {

        return this.data.exceptPermissions ?? [];

    }

    /**
     * Fetches all entries of the giveaway
     * @returns {Promise<Collection<Snowflake, User>|DisGroupDevError>}
     * @public
     */
    fetchAllEntries() {

        return new Promise(async (resolve, reject) => {

            const giveawayMessage = await this.fetchMessage().catch((err) => reject(err));

            if(!giveawayMessage) return;

            this.message = giveawayMessage;

            const giveawayReaction = this.messageReaction;

            if(!giveawayReaction) reject(new DisGroupDevError(Messages.GIVEAWAY_MISSING_REACTION(this.messageId)));

            let giveawayUsers = await giveawayReaction.users.fetch().catch(() => {});

            if(!giveawayUsers) reject(new DisGroupDevError(Messages.GIVEAWAY_MISSING_USERS(this.messageId)));

            while(giveawayUsers.size % 100 === 0) {

                const newGiveawayUsers = await giveawayReaction.users.fetch({ after: giveawayUsers.lastKey() });

                if(newGiveawayUsers.size === 0) break;

                giveawayUsers = giveawayUsers.concat(newGiveawayUsers);

            }

            const finalGiveawayUsers = giveawayUsers
                .filter((user) => !user.bot || user.bot === this.botsCanWin)
                .filter((user) => !user.id !== this.client.user.id)

            resolve(finalGiveawayUsers);

        });

    }

    /**
     * Fetches the giveaway message
     * @returns {Promise<Message|DisGroupDevError>}
     * @public
     */
    fetchMessage() {

        return new Promise(async (resolve, reject) => {

            let tryAgainLater = true;

            const giveawayChannel = await this.client.channels.fetch(this.channelId).catch((err) => { if(err.code === 10003) tryAgainLater = false });
            const giveawayMessage = await giveawayChannel(this.messageId).catch((err) => { if(err.code === 10008) tryAgainLater = false });

            if(!giveawayMessage) {

                if(!tryAgainLater) {

                    this.managers.giveaways = this.manager.giveaways.filter((giveaway) => giveaway.messageId !== this.messageId);

                    await this.manager.deleteGiveaway(this);

                }

                reject(new DisGroupDevError(Messages.UNRESOLVABLE_MESSAGE(this.messageId)));

            }

            resolve(giveawayMessage);

        });

    }

    /**
     * The id of the guild the giveaway is in
     * @returns {Snowflake|null}
     * @public
     */
    get guildId() {

        return this.data.guildId ?? null;

    }

    /**
     * The name of the user who created the giveaway
     * @returns {String|null}
     * @public
     */
    get hostedBy() {

        return this.data.hostedBy ?? null;

    }

    /**
     * The image of the giveaway
     * @returns {String|null}
     * @public
     */
    get image() {

        return this.data.image ?? null;

    }

    /**
     * If the giveaway should automatically end after the amout of reactions is the same as the winner amount
     * @returns {Boolean}
     * @public
     */
    get isDrop() {

        return this.data.isDrop ?? false;

    }

    /**
     * The last chance options for the giveaway
     * @returns {GiveawayLastChanceData}
     * @public
     */
    get lastChance() {

        return {

            embedColor: this.data.lastChance.embedColor ?? resolveColor('#fcb22d'),
            enabled: this.data.lastChance.enabled ?? false,
            message: this.data.lastChance.message ?? '⚠ **Last Chance To Enter** ⚠',
            time: this.data.lastChance.time ?? 30000

        };

    }

    /**
     * The id of the message the giveaway is
     * @returns {Snowflake|null}
     * @public
     */
    get messageId() {

        return this.message.id ?? null;

    }

    /**
     * The message reaction of the giveaway
     * @returns {MessageReaction|null}
     * @public
     */
    get messageReaction() {

        const reactionEmoji = resolvePartialEmoji(this.reaction);

        return ( this.message?.reactions.cache.find((r) => [r.emoji.id, r.emoji.name].filter(Boolean).includes(reactionEmoji?.id ?? reactionEmoji?.name)) ?? null )

    }

    /**
     * The message url of the giveaway
     * @returns {String}
     * @public
     */
    get messageURL() {

        return messageLink(this.channelId, this.messageId, this.guildId)

    }

    /**
     * The messages of the giveaway
     * @returns {GiveawayMessagesData}
     * @public
     */
    get messages() {

        return {

            drawing: (this.data.messages.drawing ?? 'Drawing: {timestamp}').replace('{timestamp}', this.endAt === Infinity ? this.pauseOptions.infiniteDurationText : `<t:${Math.round(this.endAt / 1000)}:R>`),
            drop: this.data.messages.drop ?? null,
            endedAt: this.data.messages.endedAt ?? null,
            footer: this.data.messages.footer ?? null,
            giveaway: this.data.messages.giveaway ?? '🎉 **Giveaway** 🎉',
            giveawayEnded: this.data.messages.giveawayEnded ?? '🎉 **Giveaway Ended** 🎉',
            hostedBy: this.data.messages.hostedBy ?? 'Hosted by: {this.hostedBy}',
            noWinner: this.data.messages.noWinner ?? 'The giveaway was cancelled due to no valid participations.',
            reactToParticipate: this.data.messages.reactToParticipate ?? 'React with {this.reaction} to participate!',
            title: this.data.messages.title ?? this.prize,
            winMessage: this.data.messages.winMessage ?? 'Congratulations, {winners}! You won **{this.prize}**!',
            winners: this.data.winners ?? 'Winner(s)'

        };

    }

    /**
     * Pauses the giveaway
     * @param {GiveawayPauseData} options
     * @returns {Promise<Giveaway>}
     */
    pause(options = this.pauseOptions) {

        return this.manager.pauseGiveaway(this, options);

    }

    /**
     * The pause options for the giveaway
     * @returns {GiveawayPauseData}
     * @public
     */
    get pauseOptions() {

        return {

            durationAfterPause: this.data.pauseOptions.durationAfterPause ?? null,
            embedColor: this.data.pauseOptions.embedColor ?? resolveColor('#fe6b61'),
            infiniteDurationText: this.data.pauseOptions.infiniteDurationText ?? 'NEVER',
            isPaused: this.data.pauseOptions.isPaused ?? false,
            message: this.data.pauseOptions.message ?? 'ℹ **This Giveaway Is Paused** ℹ',
            unpauseAfter: this.data.pauseOptions.unpauseAfter ?? null

        };

    }

    /**
     * The prize of the giveaway
     * @returns {String|null}
     * @public
     */
    get prize() {

        return this.data.prize ?? null;

    }

    /**
     * The reaction emoji of the giveaway
     * @returns {EmojiIdentifierResolvable|String}
     * @public
     */
    get reaction() {

        if(!this.data.reaction && this.message) {

            const emoji = resolvePartialEmoji(this.manager.options.emoji ?? '🎉');

            if(!this.message.reactions.cache.has(emoji.id ?? emoji.name)) {

                const emojiReaction = this.message.reactions.cache.reduce((p, c) => (c.count > p.count ? c : p));

                this.data.reaction = emojiReaction.emoji?.id ?? emojiReaction.emoji?.name;

            }

        }

        return resolvePartialEmoji(this.data.reaction) ?? '🎉';

    }

    /**
     * The remaining time till the end of the giveaway
     * @returns {Number}
     * @public
     */
    get remainingTime() {

        return this.endAt - Date.now();

    }

    /**
     * @typedef {Object} GiveawayRerollOptions
     * @property {Object} messages The messages for the reroll
     * @property {?String} messages.congrat The message for the new winners (default: "New winner(s): {winners}! Congratulations, you won **{this.prize}**!")
     * @property {?String} messages.error The message used when no new winners could be chosen (default: "No new winner could be chosen, due to no valid participations.")
     * @property {?Number} winners The amount of winners for the giveaway
     */

    /**
     * Rerolls the winners for the giveaway
     * @param {GiveawayRerollOptions} options 
     * @returns {Promise<Array<User>>}
     */
    reroll(options) {

        options = {

            messages: {

                congrat: options.messages.congrat ?? 'New winner(s): {winners}! Congratulations, you won **{this.prize}**!',
                error: options.messages.error ?? 'No new winner could be chosen, due to no valid participations.'

            },
            winners: options.winners ?? 1

        }

        return this.manager.rerollGiveaway(this, options);

    }

    /**
     * Rolls the winners for the giveaway
     * @returns {Promise<Array<User>>}
     * @public
     */
    roll() {

        return this.manager.rollGiveaway(this);

    }

    /**
     * The start date of the giveawaz
     * @returns {Number}
     * @public
     */
    get startAt() {

        return this.data.startAt ?? Date.now();

    }

    /**
     * The thumbnail of the giveaway
     * @returns {String|null}
     * @public
     */
    get thumbnail() {

        return this.data.thumbnail ?? null;

    }

    /**
     * Unpauses the giveaway
     * @returns {Promise<Giveaway>}
     */
    unpause() {

        return this.manager.unpauseGiveaway(this);

    }

    /**
     * The ids of the winners of the giveaway after it ended
     * @returns {Array<Snowflake>}
     * @public
     */
    get winnerIds() {

        return this.data.winnerIds ?? [];

    }

    /**
     * The amount of winners for this giveaway
     * @returns {Number}
     * @public
     */
    get winners() {

        return this.data.winners ?? 1;

    }

    /**
     * Returns the full data of the giveaway
     * @returns {GiveawayData}
     * @public
     */
    toJSON() {

        return { ...this.data };

    }

}

module.exports = Giveaway;
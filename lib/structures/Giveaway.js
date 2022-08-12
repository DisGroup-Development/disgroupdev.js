const { Client, ColorResolvable, EmojiResolvable, MessageMentionOptions, Snowflake, resolveColor } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const { EmbedBuilder, EmbedFooterOptions } = require('@discordjs/builders');

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
 * @property {GiveawayMessagesData} messages The messages of the giveaway
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
 * @property {ColorResolvable} embedColor The color of the embed while last chance is active (default: #fcb22d)
 * @property {Boolean} enabled If last chance is enabled (default: false)
 * @property {String} message The message of the last chance (default: "⚠ **Last Chance To Enter** ⚠")
 * @property {Number} time The time in milliseconds before the giveaways ends when the last chance will be enabled (default: 30000)
 */

/**
 * @typedef {Object} GiveawayMessagesData
 * @property {String} drawing The message displayed below #reactToParticipate (default: "ˋDrawing: {timestamp}ˋ")
 * @property {?String} dropMessage The message displayed in the giveaway embed displayed when the giveaway is a drop giveaway
 * @property {?String} endedAt The message displayed in the giveaway footer, next to the giveaway end date, when the givewaway has ended
 * @property {?EmbedFooterOptions} footer The footer of the giveaway embed
 * @property {String} giveaway The message displayed above the giveaway embed when the giveaway is running (default: "🎉 **Giveaway** 🎉")
 * @property {String} giveawayEnded The message displayed above the giveaway embed when the giveaway has ended (default: "🎉 **Giveaway Ended** 🎉")
 * @property {String} hostedBy The message displayed in the giveaway embed below #reactToParticipate (default: "Hosted by: {this.hostedBy}")
 * @property {String} noWinner The message displayed when there was no valid winner of the giveaway (default: "The giveaway was cancelled due to no valid participations.")
 * @property {String} reactToParticipate The message displayed in the giveaway embed (default: "React with 🎉 to participate!")
 * @property {String} title The title of the giveaway embed (default: "{this.price}")
 * @property {String} winMessage The message displayed after the giveaway ended (default: "Congratulations, {winners}! You won **{this.prize}**!")
 * @property {String} winners The message displayed in the giveaway embed before the winners (default: "Winner(s)")
 */

/**
 * @typedef {Object} GiveawayPauseData
 * @property {?Number} durationAfterPause The remaining duration of the giveaway after it has been unpaused. (This will be set automatically from the manager)
 * @property {ColorResolvable} embedColor The color of the embed while the giveaway is paused (default: #fe6b61)
 * @property {String} infiniteDurationText The text of the message when the giveaway is paused and #unpauseAfter is null (default: "`NEVER`")
 * @property {Boolean} isPaused If the giveaway is paused (default: false)
 * @property {String} message The message of the giveaway when it is paused (default: "ℹ **This Giveaway Is Paused** ℹ")
 * @property {Number} unpauseAfter The number of milliseconds after the giveaway is unpaused (default: null)
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
         * The manager of the giveaway
         * @type {GiveawayManager}
         * @public
         */
        this.manager = manager;

        /**
         * The raw data of the giveaway
         * @type {GiveawayData}
         * @private
         */
        this.data = data;

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

        return this.data.messageId ?? null;

    }

    /**
     * The messages of the giveaway
     * @returns {GiveawayMessagesData}
     * @public
     */
    get messages() {

        return {

            drawing: this.data.messages.drawing ?? 'Drawing: {timestamp}',
            dropMessage: this.data.messages.dropMessage ?? null,
            endedAt: this.data.messages.endedAt ?? null,
            footer: this.data.messages.footer ?? null

        };

    }

    /**
     * The pause options for the giveaway
     * @returns {GiveawayPauseData}
     * @public
     */
    get pause() {

        return {

            durationAfterPause: this.data.pause.durationAfterPause ?? null,
            embedColor: this.data.pause.embedColor ?? resolveColor('#fe6b61'),
            infiniteDurationText: this.data.pause.infiniteDurationText ?? 'NEVER',
            isPaused: this.data.pause.isPaused ?? false,
            message: this.data.pause.message ?? 'ℹ **This Giveaway Is Paused** ℹ',
            unpauseAfter: this.data.pause.unpauseAfter ?? null

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
     * @returns {String}
     * @public
     */
    get reaction() {

        return this.data.reaction ?? null; // @XEfnexX To-Do

    }

    /**
     * The start date of the giveawaz
     * @returns {Number}
     * @public
     */
    get startAt() {

        return this.data.startAt ?? new Date.now();

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
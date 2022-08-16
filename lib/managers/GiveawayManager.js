const { Client, ColorResolvable, EmojiResolvable, MessageMentionOptions, Snowflake } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const { EmbedBuilder, EmbedFooterOptions } = require('@discordjs/builders');
const EventEmitter = require('node:events');
const FileSystem = require('node:fs');

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



    }

    async _checkGiveaways() {



    }

    /**
     * Gets the raw ticket data from the json file
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

    async handleRawPackage(package) {



    }

    /**
     * Saves the giveaways to the json file
     * @returns {Boolean|DisGroupDevError}
     * @public
     */
    async save() {

        try {

            await FileSystem.writeFileSync(this.options.storage, JSON.stringify(this.giveaways.map((giveaway) => giveaway.data), null, 4), { encoding: 'utf-8' });

            return true;

        } catch(e) {

            throw new DisGroupDevError(e);

        }

    }

}

module.exports = GiveawayManager;
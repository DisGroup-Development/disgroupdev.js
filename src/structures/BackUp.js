/**
 * @typedef {Object} BackUpAFKData
 * @property {?import('discord.js').Snowflake} id The id of the afk channel
 * @property {?String} name The name of the afk channel
 * @property {Number} timeout The timeout for the afk channel
 */

/**
 * @typedef {Object} BackUpBanData
 * @property {import('discord.js').Snowflake} id The id of the banned member
 * @property {?String} reason The reason of the ban
 */

/**
 * @typedef {Object} BackUpChannelData
 * @property {Array<import('discord.js').CategoryChannel>} categories The categorie channels
 * @property {Array<import('discord.js').GuildChannel>} others The other channels
 */

/**
 * @typedef {Object} BackUpEmojiData
 * @property {String} name The name of the emoji
 * @property {String} url The url of the emoji
 */

/**
 * @typedef {Object} BackUpRoleData
 * @property {String} color The color of the role
 * @property {Boolean} hoist If the role is hoist
 * @property {Boolean} isEveryone If the role is [at]everyone or not
 * @property {Boolean} mentionable If the role is mentionable
 * @property {String} name The name of the role
 * @property {import('discord.js').BitField} permissions The permissions of the role
 * @property {Number} position The position of the role
 */

/**
 * @typedef {Object} BackUpRulesChannelData
 * @property {?import('discord.js').Snowflake} id The id of the rules channel
 * @property {?String} name The name of the rules channel
 */

/**
 * @typedef {Object} BackUpStickerData
 * @property {String} name The name of the sticker
 * @property {String} url The url of the sticker
 */

/**
 * @typedef {Object} BackUpSystemChannelData
 * @property {Boolean} enabled If the system channel is enabled
 * @property {?import('discord.js').SystemChannelFlags} flags The flags of the system channel 
 * @property {?import('discord.js').Snowflake} id The if of the system channel
 * @property {?String} name The name of the system channel
 */

/**
 * @typedef {Object} BackUpUpdateChannelData
 * @property {?import('discord.js').Snowflake} id The id of the update channel
 * @property {?String} name The name of the update channel
 */

/**
 * @typedef {Object} BackUpWidgetData
 * @property {Boolean} enabled If the widget is enabled
 * @property {?import('discord.js').Snowflake} id The id of the widget channel
 * @property {?String} name The name of the widget channel
 */

/**
 * @typedef {Object} BackUpData
 * @property {BackUpAFKData} afk The afk settings of the guild
 * @property {?String} bannerURL The url of the guild banner
 * @property {Array<BackUpBanData>} bans The bans of the guild
 * @property {BackUpChannelData} channels The channels of the guild
 * @property {Date} createdTimestamp The date when the backup was created
 * @property {import('discord.js').Snowflake} creatorId The if of the creator of the backup
 * @property {import('discord.js').DefaultMessageNotificationLevel} defaultMessageNotificationLevel the default message notification level of the guild
 * @property {?String} description The description of the guild
 * @property {?String} discoverySplashURL The url of the discovery splash of the guild
 * @property {Array<BackUpEmojiData>} emojis The emojis of the guild
 * @property {import('discord.js').ExplicitContentFilterLevel} explicitContentFilterLevel The explicit content filter level of the guild
 * @property {import('discord.js').Snowflake} guildId The id of the guild the backup is of
 * @property {?String} iconURL The url of the guild icon
 * @property {import('discord.js').Snowflake} id The id of the backup
 * @property {Boolean} isCommunity If the guild has the `COMMUNITY` feature
 * @property {String} locale The locale of the guild
 * @property {String} name The name of the guild
 * @property {import('discord.js').NSFWLevel} nsfwLevel The nsfw level of the guild
 * @property {Boolean} progressBar If the boost progress bar is enabled
 * @property {Array<BackUpRoleData>} roles The roles of the guild
 * @property {BackUpRulesChannelData} rulesChannel The rules channel of the guild
 * @property {?String} splashURL The url of the guild splash
 * @property {Array<BackUpStickerData>} stickers The stickers of the guild
 * @property {BackUpSystemChannelData} systemChannel The system channel of the guild
 * @property {BackUpUpdateChannelData} updateChannel The update channel of the guild
 * @property {import('discord.js').VerificationLevel} verificationLevel The verification level of the guild
 * @property {BackUpWidgetData} widget The widget settings of the guild
 */

/**
 * The backup
 */
class BackUp {

    /**
     * The constructor for the backup
     * @param {import('discord.js').Client} client The client
     * @param {BackUpManager} manager The manager of the backup
     * @param {BackUpData} data The data of the backup
     */
    constructor(client, manager, data = {}) {

        /**
         * The client
         * @type {import('discord.js').Client}
         */
        this.client = client;

        /**
         * The manager of the backup
         * @type {BackUpManager}
         */
        this.manager = manager;

        /**
         * The raw data of the backup
         * @type {BackUpData}
         * @private
         */
        this._data = data;

    }

    get afk() { return this._data?.afk }
    get bannerURL() { return this._data?.bannerURL }
    get bans() { return this._data?.bans }
    get channels() { return this._data?.channels }
    get createdTimestamp() { return this._data?.createdTimestamp }
    get creatorId() { return this._data?.creatorId }
    get data() { return this._data }
    get defaultMessageNotificationLevel() { return this._data?.defaultMessageNotificationLevel }
    get description() { return this._data?.description }
    get discoverySplashURL() { return this._data?.discoverySplashURL }
    get emojis() { return this._data?.emojis }
    get explicitContentFilterLevel() { return this._data?.explicitContentFilterLevel }
    get guildId() { return this._data?.guildId }
    get iconURL() { return this._data?.iconURL }
    get id() { return this._data?.id }
    get isCommunity() { return this._data?.isCommunity }
    get locale() { return this._data?.locale }
    get name() { return this._data?.name }
    get nsfwLevel() { return this._data?.nsfwLevel }
    get progressBar() { return this._data?.progressBar }
    get roles() { return this._data?.roles }
    get rulesChannel() { return this._data?.rulesChannel }
    get splashURL() { return this._data?.rulesChannel }
    get stickers() { return this._data?.stickers }
    get systemChannel() { return this._data?.systemChannel }
    get updateChannel() { return this._data?.updateChannel }
    get verificationLevel() { return this._data?.verificationLevel }
    get widget() { return this._data?.widget }
}

module.exports = BackUp;
const { ChannelType, Client, Snowflake, TextBasedChannelTypes } = require('discord.js');
const { ApplicationCommandType, LocalizationMap, PermissionFlagsBits } = require('discord-api-types/v10');

/**
 * @typedef {Object} ExperimentData
 * @property {Boolean} required If the experiment is required to execute the base interaction
 * @property {Number} id The id of the experiment
 */

/**
 * @typedef {Object} BaseInteractionData
 * @property {String} name The name of the base interaction
 * @property {LocalizationMap} nameLocalizations The localization names of the base interaction
 * @property {Boolean} enabled If the base interaction is enabled (default: false)
 * @property {Array<PermissionFlagsBits>} clientPermissions The permissions required for the client to execute the base interaction (default: [])
 * @property {Array<PermissionFlagsBits>} userPermissions The permissions required for the user to execute the base interaction (default: [])
 * @property {Array<PermissionFlagsBits>} defaultMemberPermissions The permissions required for the member to be able to use / see the base interaction (default: [])
 * @property {Boolean} deployEnabled If the base interaction is enabled for deploying (default: false)
 * @property {Boolean} dmEnabled If the base interaction is enabled for deloying in dms (default: true)
 * @property {String} category The category of the base interaction (Will be set automatically. default: "Other")
 * @property {Number} cooldown The cooldown of the base interaction in seconds (default: 5)
 * @property {Boolean} defer If the base interaction should be deferred (default: true)
 * @property {String} dirname The dirname of the base interaction (Will be set automatically)
 * @property {Boolean} ephemeral If the response is ephemeral (default: false)
 * @property {ExperimentData} experiment If the base interaction is an experiment (default: { required: false, id: null })
 * @property {Snowflake} id The id of the base interaction
 * @property {String} location The location of the base interaction (Will be set automatically)
 * @property {ApplicationCommandType} type The type of the base interaction (Only required for context interactions: "Message" or "User")
 * @property {Boolean} betaOnly If the command is only available in beta (default: false)
 * @property {Array<TextBasedChannelTypes>} channelOnly An array of all channel types the base interaction is available in (default: ALL)
 * @property {Boolean} devOnly If the base interaction can only be executed by developers (default: false)
 * @property {Boolean} guildOnly If the base interaction can only be executed in guilds (default: true)
 * @property {Boolean} ownerOnly If the base interaction can only be executed by the owner of the bot (default: true)
 * @property {Boolean} premiumOnly If the base interaction can only be executed by guilds who have premium perks (default: false)
 * @property {Boolean} nsfw If the base interaction can only be executed in NSFW channels (default: false)
 */

/**
 * The base interaction class.
 * @class
 */
class BaseInteraction {

    /**
     * The constructor of the base interaction class.
     * @param {Client} client
     * @param {BaseInteractionData} data
     */
    constructor(client, data = {}) {

        /**
         * The client
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The map with all cooldowns
         * @type {Map<Snowflake, Boolean>}
         * @public
         */
        this.cooldowns = new Map();

        /**
         * The raw data of the base interaction
         * @type {BaseInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * If the base interaction is beta access only
     * @returns {Boolean}
     * @public
     */
    get betaOnly() {

        return this.data.betaOnly ?? false;

    }

    /**
     * The category of the base interaction
     * @returns {String}
     * @public
     */
    get category() {

        return this.dirname ? this.dirname.split(require('path').sep)[parseInt(this.dirname.split(require('path').sep).length - 1, 10)] : 'Other';

    }

    /**
     * The types of channel the base interaction is executable in
     * @returns {Array<TextBasedChannelTypes>}
     * @public
     */
    get channelOnly() {

        return this.data.channelOnly ?? [ ChannelType.DM, ChannelType.GuildNews, ChannelType.GuildNewsThread, ChannelType.GuildPrivateThread, ChannelType.GuildPublicThread, ChannelType.GuildText, ChannelType.GuildVoice ];

    }

    /**
     * The required permissions for the client to execute the base interaction
     * @returns {Array<PermissionFlagsBits>}
     * @public
     */
    get clientPermissions() {

        return this.data.clientPermissions ?? [];

    }

    /**
     * The cooldown of the base interaction in seconds
     * @returns {Number}
     * @public
     */
    get cooldown() {

        return this.data.cooldown ?? 5;

    }

    /**
     * If the base interaction should be deferred
     * @returns {Boolean}
     * @public
     */
    get defer() {

        return this.data.defer ?? true;

    }

    /**
     * The permissions required for the member to be able to use / see the base interaction
     * @returns {Array<PermissionFlagsBits>}
     * @public
     */
    get defaultMemberPermissions() {

        return this.data.defaultMemberPermissions ?? [];

    }

    /**
     * If the base interaction is enabled for deploying
     * @returns {Boolean}
     * @public
     */
    get deployEnabled() {

        return this.data.deployEnabled ?? false;

    }

    /**
     * If the base interaction is enabled in dms by default
     * @returns {Boolean}
     * @public
     */
    get dmEnabled() {

        return this.data.dmEnabled ?? true;

    }

    /**
     * If the base interaction can only be executed by developers
     * @returns {Boolean}
     * @public
     */
    get devOnly() {

        return this.data.devOnly ?? false;

    }

    /**
     * The dirname of the saved location of the base interaction
     * @returns {String}
     * @public
     */
    get dirname() {

        return this.data.dirname ?? __dirname;

    }

    /**
     * If the base interaction is enabled
     * @returns {Boolean}
     * @public
     */
    get enabled() {

        return this.data.enabled ?? false;

    }

    /**
     * If the response is ephemeral
     * @returns {Boolean}
     * @public
     */
    get ephemeral() {

        return this.data.ephemeral ?? false;

    }

    /**
     * The experiment data of the base interaction
     * @returns {ExperimentData}
     * @public
     */
    get experiment() {

        return this.data.experiment ?? { required: false, id: null };

    }

    /**
     * If the base interaction is only executable in guilds
     * @returns {Boolean}
     * @public
     */
    get guildOnly() {

        return this.data.guildOnly ?? true;

    }

    /**
     * The id of the base interaction
     * @returns {Snowflake|null}
     * @public
     */
    get id() {

        return this.data.id ?? null;

    }

    /**
     * Sets the id of the base interaction
     * @param {Snowflake} id
     * @private
     */
    set id(id) {

        this.data.id = id;

    }

    /**
     * The location of the base interaction
     * @returns {String}
     * @public
     */
    get location() {

        return this.data.location ?? this.dirname;

    }

    /**
     * Sets the location of the base interaction
     * @param  path
     * @public
     */
    set location(path) {

        this.data.location = path;
        
    }

    /**
     * The name of the base interaction
     * @returns {String|null}
     * @public
     */
    get name() {

        return this.data.name ?? null;

    }

    /**
     * The localization names of the base interaction
     * @returns {LocalizationMap|null}
     * @public
     */
    get nameLocalizations() {

        return this.data.nameLocalizations ?? null

    }

    /**
     * If the base interaction is nsfw
     * @returns {Boolean}
     * @public
     */
    get nsfw() {

        return this.data.nsfw ?? false;

    }

    /**
     * If the base interaction is owner access only
     * @returns {Boolean}
     * @public
     */
    get ownerOnly() {

        return this.data.ownerOnly ?? true;

    }

    /**
     * If the base interaction is premium access only
     * @returns {Boolean}
     * @public
     */
    get premiumOnly() {

        return this.data.premiumOnly ?? false;

    }

    /**
     * The type of the base interaction
     * @returns {ApplicationCommandType|null}
     * @public
     */
    get type() {

        return this.data.type ?? null;

    }

    /**
     * The required permissions for the user to execute the base interaction
     * @returns {Array<PermissionFlagsBits>}
     * @public
     */
    get userPermissions() {

        return this.data.userPermissions ?? [];

    }

    /**
     * The full data of the base interaction
     * @returns {BaseInteractionData}
     * @public
     */
    toJSON() {

        return { ...this.data };

    }

}

module.exports = BaseInteraction;
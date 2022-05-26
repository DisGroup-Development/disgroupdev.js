const { Client, PermissionString, Snowflake, TextBasedChannelTypes } = require('discord.js');

/**
 * @typedef {Object} ExperimentData
 * @property {Boolean} required If the experiment is required to execute the base component
 * @property {Number} id The id of the experiment
 */

/**
 * @typedef {Object} BaseComponentData
 * @property {String} name The name of the base component
 * @property {Boolean} enabled If the base component is enabled (default: false)
 * @property {Array<PermissionString>} clientPermissions The permissions required for the client to execute the base component (default: [])
 * @property {Array<PermissionString>} userPermissions The permissions required for the user to execute the base component (default: [])
 * @property {String} category The category of the base component (Will be set automatically. default: "Other")
 * @property {Number} cooldown The cooldown of the base component in seconds (default: 5)
 * @property {String} customId The custom id of the base component
 * @property {Boolean} defer If the base component should be deferred (default: true)
 * @property {String} dirname The dirname of the base component (Will be set automatically)
 * @property {Boolean} ephemeral If the response is ephemeral (default: false)
 * @property {ExperimentData} experiment If the base component is an experiment (default: { required: false, id: null })
 * @property {String} location The location of the base component (Will be set automatically)
 * @property {Boolean} betaOnly If the command is only available in beta (default: false)
 * @property {Array<TextBasedChannelTypes>} channelOnly An array of all channel types the base component is available in (default: ALL)
 * @property {Boolean} devOnly If the base component can only be executed by developers (default: false)
 * @property {Boolean} guildOnly If the base component can only be executed in guilds (default: true)
 * @property {Boolean} ownerOnly If the base component can only be executed by the owner of the bot (default: true)
 * @property {Boolean} premiumOnly If the base component can only be executed by guilds who have premium perks (default: false)
 * @property {Boolean} nsfw If the base component can only be executed in NSFW channels (default: false)
 */

/**
 * The base component class.
 * @class
 */
class BaseComponent {

    /**
     * The constructor of the base component class.
     * @param {Client} client
     * @param {BaseComponentData} data
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
         * The raw data of the base component
         * @type {BaseComponentData}
         * @private
         */
        this.data = data;

    }

    /**
     * If the base component is beta access only
     * @returns {Boolean}
     * @public
     */
    get betaOnly() {

        return this.data.betaOnly ?? false;

    }

    /**
     * The category of the base component
     * @returns {String}
     * @public
     */
    get category() {

        return this.dirname ? this.dirname.split(require('path').sep)[parseInt(this.dirname.split(require('path').sep).length - 1, 10)] : 'Other';

    }

    /**
     * The types of channel the base component is executable in
     * @returns {Array<TextBasedChannelTypes>}
     * @public
     */
    get channelOnly() {

        return this.data.channelOnly ?? ['DM', 'GUILD_NEWS', 'GUILD_TEXT', 'GUILD_NEWS_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'];

    }

    /**
     * The required permissions for the client to execute the base component
     * @returns {Array<PermissionString>}
     * @public
     */
    get clientPermissions() {

        return this.data.clientPermissions ?? [];

    }

    /**
     * The cooldown of the base component in seconds
     * @returns {Number}
     * @public
     */
    get cooldown() {

        return this.data.cooldown ?? 5;

    }

    /**
     * If the base component should be deferred
     * @returns {Boolean}
     * @public
     */
    get defer() {

        return this.data.defer ?? true;

    }

    /**
     * If the base component can only be executed by developers
     * @returns {Boolean}
     * @public
     */
    get devOnly() {

        return this.data.devOnly ?? false;

    }

    /**
     * The dirname of the saved location of the base component
     * @returns {String}
     * @public
     */
    get dirname() {

        return this.data.dirname ?? __dirname;

    }

    /**
     * If the base component is enabled
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
     * The experiment data of the base component
     * @returns {ExperimentData}
     * @public
     */
    get experiment() {

        return this.data.experiment ?? { required: false, id: null };

    }

    /**
     * If the base component is only executable in guilds
     * @returns {Boolean}
     * @public
     */
    get guildOnly() {

        return this.data.guildOnly ?? true;

    }

    /**
     * The location of the base component
     * @returns {String}
     * @public
     */
    get location() {

        return this.data.location ?? this.dirname;

    }

    /**
     * Sets the location of the base component
     * @param  path
     * @public
     */
    set location(path) {

        this.data.location = path;
    }

    /**
     * The name of the base component
     * @returns {String|null}
     * @public
     */
    get name() {

        return this.data.name ?? null;

    }

    /**
     * If the base component is nsfw
     * @returns {Boolean}
     * @public
     */
    get nsfw() {

        return this.data.nsfw ?? false;

    }

    /**
     * If the base component is owner access only
     * @returns {Boolean}
     * @public
     */
    get ownerOnly() {

        return this.data.ownerOnly ?? true;

    }

    /**
     * If the component is premium access only
     * @returns {Boolean}
     * @public
     */
    get premiumOnly() {

        return this.data.premiumOnly ?? false;

    }

    /**
     * The required permissions for the user to execute the base component
     * @returns {Array<PermissionString>}
     * @public
     */
    get userPermissions() {

        return this.data.userPermissions ?? [];

    }

    /**
     * The full data of the base component
     * @returns {BaseComponentData}
     * @public
     */
    toJSON() {

        return { ...this.data };

    }

}

module.exports = BaseComponent;
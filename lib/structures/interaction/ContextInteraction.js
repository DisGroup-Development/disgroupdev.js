const { ApplicationCommandType, Client, PermissionString, Snowflake, TextBasedChannelTypes } = require('discord.js');
const { LocalizationMap } = require('discord-api-types/v10');
const BaseInteraction = require('./BaseInteraction');

/**
 * @typedef {Object} ExperimentData
 * @property {Boolean} required If the experiment is required to execute the context interaction
 * @property {Number} id The id of the experiment
 */

/**
 * @typedef {Object} ContextInteractionData
 * @property {String} name The name of the context interaction
 * @property {LocalizationMap} nameLocalizations The localization names of the context interaction
 * @property {Boolean} enabled If the context interaction is enabled (default: false)
 * @property {Array<PermissionString>} clientPermissions The permissions required for the client to execute the context interaction (default: [])
 * @property {Array<PermissionString>} userPermissions The permissions required for the user to execute the context interaction (default: [])
 * @property {String} category The category of the context interaction (Will be set automatically. default: "Other")
 * @property {Number} cooldown The cooldown of the context interaction in seconds (default: 5)
 * @property {Boolean} defer If the context interaction should be deferred (default: true)
 * @property {String} dirname The dirname of the context interaction (Will be set automatically)
 * @property {Boolean} ephemeral If the response is ephemeral (default: false)
 * @property {ExperimentData} experiment If the context interaction is an experiment (default: { required: false, id: null })
 * @property {Snowflake} id The id of the context interaction
 * @property {String} location The location of the context interaction (Will be set automatically)
 * @property {ApplicationCommandType} type The type of the base interaction (Only required for context interactions: "MESSAGE" or "USER")
 * @property {Boolean} betaOnly If the command is only available in beta (default: false)
 * @property {Array<TextBasedChannelTypes>} channelOnly An array of all channel types the context interaction is available in (default: ALL)
 * @property {Boolean} devOnly If the context interaction can only be executed by developers (default: false)
 * @property {Boolean} guildOnly If the context interaction can only be executed in guilds (default: true)
 * @property {Boolean} ownerOnly If the context interaction can only be executed by the owner of the bot (default: true)
 * @property {Boolean} premiumOnly If the context interaction can only be executed by guilds who have premium perks (default: false)
 * @property {Boolean} nsfw If the context interaction can only be executed in NSFW channels (default: false)
 */

/**
 * The context interaction class.
 * @class
 */
class ContextInteraction extends BaseInteraction {

    /**
     * The constructor of the context interaction class.
     * @param {Client} client 
     * @param {ContextInteractionManager} manager 
     * @param {ContextInteractionData} data 
     */
    constructor(client, manager, data = {}) {

        super(client, data);

        /**
         * The context interaction manager
         * @type {ContextInteractionManager}
         * @public
         */
        this.manager = manager;
 
        /**
         * The raw data of the context interaction
         * @type {ContextInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Reloads the context interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load() {

        return this.manager.load(this.location);

    }

    /**
     * Reloads the context interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload() {

        return this.manager.reload(this.name);

    }

    /**
     * Unloads the context interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload() {

        return this.manager.unload(this.name);

    }

}

module.exports = ContextInteraction;
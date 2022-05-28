const { ApplicationCommandType, Client, PermissionString, Snowflake, TextBasedChannelTypes } = require('discord.js');
const { LocalizationMap } = require('discord-api-types/v10');
const BaseInteraction = require('./BaseInteraction');

/**
 * @typedef {Object} ExperimentData
 * @property {Boolean} required If the experiment is required to execute the modal interaction
 * @property {Number} id The id of the experiment
 */

/**
 * @typedef {Object} ModalInteractionData
 * @property {String} name The name of the modal interaction
 * @property {LocalizationMap} nameLocalizations The localization names of the modal interaction
 * @property {Boolean} enabled If the modal interaction is enabled (default: false)
 * @property {Array<PermissionString>} clientPermissions The permissions required for the client to execute the modal interaction (default: [])
 * @property {Array<PermissionString>} userPermissions The permissions required for the user to execute the modal interaction (default: [])
 * @property {Boolean} deployEnabled If the modal interaction is enabled for deploying (default: false)
 * @property {String} category The category of the modal interaction (Will be set automatically. default: "Other")
 * @property {Number} cooldown The cooldown of the modal interaction in seconds (default: 5)
 * @property {Boolean} defaultEnabled If the modal interaction is enabled by default (default: false)
 * @property {Boolean} defer If the modal interaction should be deferred (default: true)
 * @property {String} dirname The dirname of the modal interaction (Will be set automatically)
 * @property {Boolean} ephemeral If the response is ephemeral (default: false)
 * @property {ExperimentData} experiment If the modal interaction is an experiment (default: { required: false, id: null })
 * @property {Snowflake} id The id of the modal interaction
 * @property {String} location The location of the modal interaction (Will be set automatically)
 * @property {ApplicationCommandType} type The type of the base interaction (Only required for modal interactions: "MESSAGE" or "USER")
 * @property {Boolean} betaOnly If the command is only available in beta (default: false)
 * @property {Array<TextBasedChannelTypes>} channelOnly An array of all channel types the modal interaction is available in (default: ALL)
 * @property {Boolean} devOnly If the modal interaction can only be executed by developers (default: false)
 * @property {Boolean} guildOnly If the modal interaction can only be executed in guilds (default: true)
 * @property {Boolean} ownerOnly If the modal interaction can only be executed by the owner of the bot (default: true)
 * @property {Boolean} premiumOnly If the modal interaction can only be executed by guilds who have premium perks (default: false)
 * @property {Boolean} nsfw If the modal interaction can only be executed in NSFW channels (default: false)
 */

/**
 * The modal interaction class.
 * @class
 */
class ModalInteraction extends BaseInteraction {

    /**
     * The constructor of the modal interaction class.
     * @param {Client} client
     * @param {ModalInteractionManager} manager
     * @param {ModalInteractionData} data
     */
    constructor(client, manager, data = {}) {

        super(client, data);

        /**
         * The modal interaction manager
         * @type {ModalInteractionManager}
         * @public
         */
        this.manager = manager;

        /**
         * The raw data of the modal interaction
         * @type {ModalInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * If the modal interaction is enabled by default
     * @returns {Boolean}
     * @public
     */
    get defaultEnabled() {

        return this.data.defaultEnabled ?? false;

    }

    /**
     * Deploys the modal interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    deploy() {

        return this.manager.deploy(this);

    }

    /**
     * If deploying is enabled for the modal interaction
     * @returns {Boolean}
     * @public
     */
    get deployEnabled() {

        return this.data.deployEnabled ?? false;

    }

    /**
     * Reloads the modal interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load() {

        return this.manager.load(this.location);

    }

    /**
     * Reloads the modal interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload() {

        return this.manager.reload(this.name);

    }

    /**
     * Unloads the modal interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload() {

        return this.manager.unload(this.name);

    }

}

module.exports = ModalInteraction;
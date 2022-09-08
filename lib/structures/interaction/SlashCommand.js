'use strict';

const BaseInteraction = require('./BaseInteraction');

/**
 * @typedef {Object} ExperimentData
 * @property {Boolean} required If the experiment is required to execute the slash command
 * @property {Number} id The id of the experiment
 */

/**
 * @typedef {Object} SlashCommandData
 * @property {String} name The name of the slash command
 * @property {LocalizationMap} nameLocalizations The localization names of the slash command
 * @property {String} description The description of the slash command
 * @property {LocalizationMap} descriptionLocalizations The localization descriptions of the slash command
 * @property {String} usage The usage of the slash command
 * @property {Boolean} enabled If the slash command is enabled (default: false)
 * @property {Array<PermissionFlagsBits>} clientPermissions The permissions required for the client to execute the slash command (default: [])
 * @property {Array<PermissionFlagsBits>} userPermissions The permissions required for the user to execute the slash command (default: [])
 * @property {Boolean} deployEnabled If the slash command is enabled for deploying (default: false)
 * @property {Boolean} dmEnabled If the slash command is enabled for deloying in dms (default: true)
 * @property {Array<ApplicationCommandOptionData>} options The options of the slash command
 * @property {String} category The category of the slash command (Will be set automatically. default: "Other")
 * @property {Number} cooldown The cooldown of the slash command in seconds (default: 5)
 * @property {Boolean} defaultEnabled If the slash command is enabled by default (default: false)
 * @property {Boolean} defer If the slash command should be deferred (default: true)
 * @property {String} dirname The dirname of the slash command (Will be set automatically)
 * @property {Boolean} ephemeral If the response is ephemeral (default: false)
 * @property {ExperimentData} experiment If the slash command is an experiment (default: { required: false, id: null })
 * @property {Boolean} hidden If the slash command should be hidden in the list (default: false)
 * @property {Snowflake} id The id of the slash command
 * @property {String} location The location of the slash command (Will be set automatically)
 * @property {Boolean} betaOnly If the command is only available in beta (default: false)
 * @property {Array<TextBasedChannelTypes>} channelOnly An array of all channel types the slash command is available in (default: ALL)
 * @property {Boolean} devOnly If the slash command can only be executed by developers (default: false)
 * @property {Boolean} guildOnly If the slash command can only be executed in guilds (default: true)
 * @property {Boolean} ownerOnly If the slash command can only be executed by the owner of the bot (default: true)
 * @property {Boolean} premiumOnly If the slash command can only be executed by guilds who have premium perks (default: false)
 * @property {Boolean} nsfw If the slash command can only be executed in NSFW channels (default: false)
 */

/**
 * The slash command class.
 * @extends {BaseInteraction}
 * @class
 */
class SlashCommand extends BaseInteraction {
    /**
     * The constructor of the slash command class.
     * @param {Client} client The client
     * @param {SlashCommandInteractionManager} manager The slash command interaction manager
     * @param {SlashCommandData} data The data of the slash command
     */
    constructor(client, manager, data = {}) {
        super(client, data);

        /**
         * The slash command manager
         * @type {SlashCommandInteractionManager}
         * @public
         */
        this.manager = manager;

        /**
         * The raw data of the slash command
         * @type {SlashCommandData}
         * @private
         */
        this.data = data;
    }

    /**
     * Deploys the slash command
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    deploy() {
        return this.manager.deploy(this);
    }

    /**
     * If deploying is enabled for the slash command
     * @returns {Boolean}
     * @public
     */
    get deployEnabled() {
        return this.data.deployEnabled ?? false;
    }

    /**
     * The description of the slash command
     * @returns {String|null}
     * @public
     */
    get description() {
        return this.data.description ?? null;
    }

    /**
     * The localization descriptions of the slash command
     * @returns {LocalizationMap|null}
     */
    get descriptionLocalizations() {
        return this.data.descriptionLocalizations ?? null;
    }

    /**
     * If the slash command should be hidden in the list
     * @returns {Boolean}
     * @public
     */
    get hidden() {
        return this.data.hidden ?? false;
    }

    /**
     * Loads the slash command
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load() {
        return this.manager.load(this.location);
    }

    /**
     * The options of the slash command
     * @returns {Array<ApplicationCommandOptionData>}
     * @public
     */
    get options() {
        return this.data.options ?? [];
    }

    /**
     * The usage of the slash command with all arguments
     * @returns {String}
     * @public
     */
    get usage() {
        return this.data.usage ?? `/${this.name}`;
    }

    /**
     * Reloads the slash command
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload() {
        return this.manager.reload(this.name);
    }

    /**
     * Unloads the slash command
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload() {
        return this.manager.unload(this.name);
    }
}

module.exports = SlashCommand;

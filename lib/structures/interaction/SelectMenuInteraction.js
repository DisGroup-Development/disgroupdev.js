const { Client, MessageSelectMenu, MessageSelectOptionData, PermissionString, TextBasedChannelTypes } = require('discord.js');
const BaseComponent = require('./BaseComponent');

const { DisGroupDevError, Messages } = require('../../errors/DisGroupDevError');

/**
 * @typedef {Object} ExperimentData
 * @property {Boolean} required If the experiment is required to execute the select menu interaction
 * @property {Number} id The id of the experiment
 */

/**
 * @typedef {Object} SelectMenuInteractionData
 * @property {String} name The name of the select menu interaction
 * @property {Boolean} enabled If the select menu interaction is enabled (default: false)
 * @property {Array<PermissionString>} clientPermissions The permissions required for the client to execute the select menu interaction (default: [])
 * @property {Array<PermissionString>} userPermissions The permissions required for the user to execute the select menu interaction (default: [])
 * @property {String} category The category of the select menu interaction (Will be set automatically. default: "Other")
 * @property {Number} cooldown The cooldown of the select menu interaction in seconds (default: 5)
 * @property {String} customId The custom id of the select menu interaction
 * @property {Boolean} defer If the select menu interaction should be deferred (default: true)
 * @property {String} dirname The dirname of the select menu interaction (Will be set automatically)
 * @property {Boolean} disabled If the select menu is disabled (default: false)
 * @property {Boolean} ephemeral If the response is ephemeral (default: false)
 * @property {ExperimentData} experiment If the select menu interaction is an experiment (default: { required: false, id: null })
 * @property {String} location The location of the select menu interaction (Will be set automatically)
 * @property {Number} maxValues The maximum amount of values the user can choose from the select menu (default: 1)
 * @property {Number} minValues The minimum amount of values the user can choose from the select menu (default: 1)
 * @property {MessageSelectOptionData[]} options The options of the select menu
 * @property {String} placeholder The placeholder of the select menu
 * @property {Boolean} betaOnly If the command is only available in beta (default: false)
 * @property {Array<TextBasedChannelTypes>} channelOnly An array of all channel types the select menu interaction is available in (default: ALL)
 * @property {Boolean} devOnly If the select menu interaction can only be executed by developers (default: false)
 * @property {Boolean} guildOnly If the select menu interaction can only be executed in guilds (default: true)
 * @property {Boolean} ownerOnly If the select menu interaction can only be executed by the owner of the bot (default: true)
 * @property {Boolean} premiumOnly If the select menu interaction can only be executed by guilds who have premium perks (default: false)
 * @property {Boolean} nsfw If the select menu interaction can only be executed in NSFW channels (default: false)
 */

/**
 * The select menu interaction class.
 * @class
 */
class SelectMenuInteraction extends BaseComponent {

    /**
     * The constructor of the select menu interaction class.
     * @param {Client} client
     * @param {SelectMenuInteractionManager} manager
     * @param {SelectMenuInteractionData} data
     */
    constructor(client, manager, data = {}) {

        super(client, data);

        /**
         * The select menu interaction manager
         * @type {SelectMenuInteractionManager}
         * @public
         */
        this.manager = manager;

        /**
         * The raw data of the select menu interaction
         * @type {SelectMenuInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Builds the select menu
     * @returns {MessageSelectMenu|DisGroupDevError}
     * @public
     */
    buildSelectMenu() {

        try {

            const selectMenu = new MessageSelectMenu()
                .setCustomId(this.customId)
                .setDisabled(this.disabled)
                .setMaxValues(this.maxValues)
                .setMinValues(this.minValues)
                .setOptions(this.options)
                .setPlaceholder(this.placeholder)

            return selectMenu;

        } catch (e) {

            throw new DisGroupDevError(e);

        }

    }

    /**
     * If the select menu is disabled
     * @returns {Boolean}
     * @public
     */
    get disabled() {

        return this.data.disabled ?? false;

    }

    /**
     * Reloads the select menu interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load() {

        return this.manager.load(this.location);

    }

    /**
     * The max values of the select menu
     * @returns {Number}
     * @public
     */
    get maxValues() {

        return this.data.maxValues ?? 1;

    }

    /**
     * The min values of the select menu
     * @returns {Number}
     * @public
     */
    get minValues() {

        return this.data.minValues ?? 1;

    }

    /**
     * The options of the select menu
     * @returns {MessageSelectOptionData[]}
     * @public
     */
    get options() {

        return this.data.options ?? [];

    }

    /**
     * The placeholder of the select menu
     * @returns {String|null}
     */
    get placeholder() {

        return this.data.placeholder ?? null;

    }

    /**
     * Reloads the select menu interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload() {

        return this.manager.reload(this.name);

    }

    /**
     * Unloads the select menu interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload() {

        return this.manager.unload(this.name);

    }

}

module.exports = SelectMenuInteraction;
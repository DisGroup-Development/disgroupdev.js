const { Client, MessageActionRow, MessageActionRowComponentResolvable, Modal, PermissionString, TextBasedChannelTypes } = require('discord.js');
const BaseComponent = require('./BaseComponent');

const { DisGroupDevError, Messages } = require('../../errors/DisGroupDevError');

/**
 * @typedef {Object} ExperimentData
 * @property {Boolean} required If the experiment is required to execute the modal interaction
 * @property {Number} id The id of the experiment
 */

/**
 * @typedef {Object} ModalInteractionData
 * @property {String} name The name of the modal interaction
 * @property {Boolean} enabled If the modal interaction is enabled (default: false)
 * @property {Array<PermissionString>} clientPermissions The permissions required for the client to execute the modal interaction (default: [])
 * @property {Array<PermissionString>} userPermissions The permissions required for the user to execute the modal interaction (default: [])
 * @property {String} category The category of the modal interaction (Will be set automatically. default: "Other")
 * @property {...MessageActionRowComponentResolvable[]} components The components of the modal
 * @property {Number} cooldown The cooldown of the modal interaction in seconds (default: 5)
 * @property {String} customId The custom id of the modal interaction
 * @property {Boolean} defer If the modal interaction should be deferred (default: true)
 * @property {String} dirname The dirname of the modal interaction (Will be set automatically)
 * @property {Boolean} ephemeral If the response is ephemeral (default: false)
 * @property {ExperimentData} experiment If the modal interaction is an experiment (default: { required: false, id: null })
 * @property {String} location The location of the modal interaction (Will be set automatically)
 * @property {String} title The title of the modal
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
class ModalInteraction extends BaseComponent {

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
     * Builds the modal
     * @returns {Modal|DisGroupDevError}
     * @public
     */
    buildModal() {

        try {

            const modal = new Modal()
                .setComponents(
                    new MessageActionRow()
                        .setComponents(this.components)
                )
                .setCustomId(this.customId)
                .setTitle(this.title)

            return modal;

        } catch (e) {

            throw new DisGroupDevError(e);

        }

    }

    /**
     * The components of the modal
     * @returns {...MessageActionRowComponentResolvable[]}
     */
    get components() {

        return this.data.components ?? [];

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
     * The title of the modal
     * @returns {String}
     * @public
     */
    get title() {

        return this.data.title ?? ' ';

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
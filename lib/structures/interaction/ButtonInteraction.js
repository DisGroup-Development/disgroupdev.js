const { Client, TextBasedChannelTypes } = require('discord.js');
const { APIMessageComponentEmoji, ButtonStyle } = require('discord-api-types/v10');
const { ButtonBuilder } = require('@discordjs/builders');
const BaseComponent = require('./BaseComponent');

const { DisGroupDevError, Messages } = require('../../errors/DisGroupDevError');

/**
 * @typedef {Object} ExperimentData
 * @property {Boolean} required If the experiment is required to execute the button interaction
 * @property {Number} id The id of the experiment
 */

/**
 * @typedef {Object} ButtonInteractionData
 * @property {String} name The name of the button interaction
 * @property {Boolean} enabled If the button interaction is enabled (default: false)
 * @property {Array<PermissionFlagsBits>} clientPermissions The permissions required for the client to execute the button interaction (default: [])
 * @property {Array<PermissionFlagsBits>} userPermissions The permissions required for the user to execute the button interaction (default: [])
 * @property {String} category The category of the button interaction (Will be set automatically. default: "Other")
 * @property {Number} cooldown The cooldown of the button interaction in seconds (default: 5)
 * @property {String} customId The custom id of the button interaction
 * @property {Boolean} defer If the button interaction should be deferred (default: true)
 * @property {String} dirname The dirname of the button interaction (Will be set automatically)
 * @property {Boolean} disabled If the button is disabled (default: false)
 * @property {APIMessageComponentEmoji} emoji The emoji of the button
 * @property {Boolean} ephemeral If the response is ephemeral (default: false)
 * @property {ExperimentData} experiment If the button interaction is an experiment (default: { required: false, id: null })
 * @property {String} label The label of the button
 * @property {String} location The location of the button interaction (Will be set automatically)
 * @property {ButtonStyle} style The style of the button (default: Success)
 * @property {URL} url The url of the button
 * @property {Boolean} betaOnly If the command is only available in beta (default: false)
 * @property {Array<TextBasedChannelTypes>} channelOnly An array of all channel types the button interaction is available in (default: ALL)
 * @property {Boolean} devOnly If the button interaction can only be executed by developers (default: false)
 * @property {Boolean} guildOnly If the button interaction can only be executed in guilds (default: true)
 * @property {Boolean} ownerOnly If the button interaction can only be executed by the owner of the bot (default: true)
 * @property {Boolean} premiumOnly If the button interaction can only be executed by guilds who have premium perks (default: false)
 * @property {Boolean} nsfw If the button interaction can only be executed in NSFW channels (default: false)
 */

/**
 * The button interaction class.
 * @class
 */
class ButtonInteraction extends BaseComponent {

    /**
     * The constructor of the button interaction class.
     * @param {Client} client
     * @param {ButtonInteractionManager} manager
     * @param {ButtonInteractionData} data
     */
    constructor(client, manager, data = {}) {

        super(client, data);

        /**
         * The button interaction manager
         * @type {ButtonInteractionManager}
         * @public
         */
        this.manager = manager;

        /**
         * The raw data of the button interaction
         * @type {ButtonInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Builds the button
     * @returns {MessageButton|DisGroupDevError}
     * @public
     */
    buildButton() {

        try {

            const button = new ButtonBuilder()
                .setCustomId(this.customId)
                .setDisabled(this.disabled)
                .setEmoji(this.emoji)
                .setLabel(this.label)
                .setStyle(this.style)
                .setURL(this.url)

            return button;

        } catch(e) {

            throw new DisGroupDevError(e);

        }

    }

    /**
     * If the button is disabled
     * @returns {Boolean}
     * @public
     */
    get disabled() {

        return this.data.disabled ?? false;

    }

    /**
     * The emoji of the button
     * @returns {APIMessageComponentEmoji|null}
     */
    get emoji() {

        return this.data.emoji ?? null;

    }

    /**
     * The label of the button
     * @returns {String}
     */
    get label() {

        return this.data.label ?? ' ';

    }

    /**
     * Reloads the button interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load() {

        return this.manager.load(this.location);

    }

    /**
     * Reloads the button interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload() {

        return this.manager.reload(this.name);

    }

    /**
     * The style of the button
     * @returns {ButtonStyle}
     */
    get style() {

        return this.data.style ?? ButtonStyle.Success;

    }

    /**
     * Unloads the button interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload() {

        return this.manager.unload(this.name);

    }

    /**
     * The url of the button
     * @returns {URL|null}
     */
    get url() {

        return this.data.url ?? null;

    }

}

module.exports = ButtonInteraction;
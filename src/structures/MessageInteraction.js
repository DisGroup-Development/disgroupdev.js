const BaseInteraction = require('./BaseInteraction');
const Discord = require('discord.js');

/**
 * @typedef {Object} MessageInteractionData The raw data of the message interaction
 * @property {String} name The name of the message interaction
 * @property {String} description The description of the message interaction
 * @property {?Boolean} enabled If the message interaction is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?Boolean} deployEnabled If the deploying of the message interaction is enabled (Default: true)
 * @property {?String} category The name of the category of the message interaction (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the message interaction (Default: 5)
 * @property {?Boolean} defaultEnabled If the message interaction is enabled for @everyone (Default: true)
 * @property {?String} dirname The dirname of the message interaction (Will be set automatically)
 * @property {?Boolean} ephemeral If the message interaction is ephermeral reply only (Default: false)
 * @property {?Discord.Snowflake} id The id of the message interaction (Will be set automatically)
 * @property {?String} location The location of the message interaction (Will be set automatically)
 * @property {?Boolean} betaOnly If the message interaction is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the command can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the message interaction is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the message interaction is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the message interaction is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the message interaction is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the message interaction is premium only (Default: false)
 * @property {?Boolean} nsfw If the message interaction is nsfw (Default: false)
 */

/**
 * The message interaction
 * @extends {BaseInteraction}
 */
class MessageInteraction extends BaseInteraction {

    /**
     * The constructor of the message interaction
     * @param client {Discord.Client}
     * @param data {MessageInteractionData}
     */
    constructor(client, data = {}) {

        super(client, data);

        /**
         * The raw data of the message interaction
         * @type {MessageInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Checks if the message interaction is enabled for @everyone
     * @return {?Boolean}
     */
    get defaultEnabled() {

        return this.data?.defaultEnabled ?? true;

    }

    /**
     * Checks if deploying is enabled for the message interaction
     * @returns {Boolean}
     * @public
     */
    get deployEnabled() {

        return this.data?.deployEnabled ?? true;

    }

    /**
     * Gets the id of the message interaction
     * @returns {?Discord.Snowflake|String}
     * @public
     */
    get id() {

        return this.data?.id ?? ' ';

    }


    /**
     * Sets the id of the message interaction
     * @param {Discord.Snowflake} id
     * @returns {MessageInteraction}
     * @private
     */
    setID(id) {

        this.data?.id === id;

        return this;

    }

}

module.exports = MessageInteraction;
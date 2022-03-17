const BaseInteraction = require('./BaseInteraction');
const Discord = require('discord.js');

/**
 * @typedef {Object} UserInteractionData The raw data of the user interaction
 * @property {String} name The name of the user interaction
 * @property {String} description The description of the user interaction
 * @property {?Boolean} enabled If the user interaction is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?Boolean} deployEnabled If the deploying of the user interaction is enabled (Default: true)
 * @property {?String} category The name of the category of the user interaction (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the user interaction (Default: 5)
 * @property {?Boolean} defaultEnabled If the user interaction is enabled for @everyone (Default: true)
 * @property {?String} dirname The dirname of the user interaction (Will be set automatically)
 * @property {?Boolean} ephemeral If the user interaction is ephermeral reply only (Default: false)
 * @property {?Discord.Snowflake} id The id of the user interaction (Will be set automatically)
 * @property {?String} location The location of the user interaction (Will be set automatically)
 * @property {?Boolean} betaOnly If the user interaction is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the command can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the user interaction is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the user interaction is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the user interaction is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the user interaction is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the user interaction is premium only (Default: false)
 * @property {?Boolean} nsfw If the user interaction is nsfw (Default: false)
 */

/**
 * The user interaction
 * @extends {BaseInteraction}
 */
class UserInteraction extends BaseInteraction {

    /**
     * The constructor of the user interaction
     * @param client {Discord.Client}
     * @param manager {UserInteractionManager}
     * @param data {UserInteractionData}
     */
    constructor(client, manager, data = {}) {

        super(client, manager, data);

        /**
         * The raw data of the user interaction
         * @type {UserInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Checks if the user interaction is enabled for @everyone
     * @return {?Boolean}
     */
    get defaultEnabled() {

        return this.data?.defaultEnabled ?? true;

    }

    /**
     * Checks if deploying is enabled for the user interaction
     * @returns {Boolean}
     * @public
     */
    get deployEnabled() {

        return this.data?.deployEnabled ?? true;

    }

    /**
     * Gets the id of the user interaction
     * @returns {?Discord.Snowflake|String}
     * @public
     */
    get id() {

        return this.data?.id ?? ' ';

    }


    /**
     * Sets the id of the user interaction
     * @param {Discord.Snowflake} id
     * @returns {UserInteraction}
     * @private
     */
    setID(id) {

        this.data?.id === id;

        return this;

    }

}

module.exports = UserInteraction;
const BaseInteraction = require('./BaseInteraction');
const Discord = require('discord.js');

/**
 * @typedef {Object} ButtonInteractionData The raw data of the button interaction
 * @property {String} name The name of the button interaction
 * @property {?Boolean} enabled If the button interaction is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?String} category The name of the category of the button interaction (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the button interaction (Default: 5)
 * @property {?String} customID The custom id of the button interaction
 * @property {?Boolean} defaultEnabled If the button interaction is enabled for @everyone (Default: true)
 * @property {?String} dirname The dirname of the button interaction (Will be set automatically)
 * @property {String} emoji The emoji of the button
 * @property {?Boolean} ephemeral If the button interaction is ephermeral reply only (Default: false)
 * @property {?String} label The label of the button
 * @property {?String} location The location of the button interaction (Will be set automatically)
 * @property {?Discord.MessageButtonStyleResolvable} style The style of the button
 * @property {?String} url The url the button leads to. (Can only be set when `style` is "LINK")
 * @property {?Boolean} betaOnly If the button interaction is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the interaction can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the button interaction is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the button interaction is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the button interaction is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the button interaction is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the button interaction is premium only (Default: false)
 * @property {?Boolean} nsfw If the button interaction is nsfw (Default: false)
 */

/**
 * The button interaction
 * @extends {BaseInteraction}
 */
class ButtonInteraction extends BaseInteraction {

    /**
     * The constructor of the button interaction
     * @param client {Discord.Client}
     * @param manager {ButtonInteractionManager}
     * @param data {ButtonInteractionData}
     */
    constructor(client, manager, data = {}) {

        super(client, manager, data);

        /**
         * The raw data of the button interaction
         * @type {ButtonInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Gets the custom id of the button interaction
     * @returns {?Discord.Snowflake|String}
     * @public
     */
    get customID() {

        return this.data?.customID ?? ' ';

    }

    /**
     * Checks if the button interaction is enabled for @everyone
     * @return {?Boolean}
     */
    get defaultEnabled() {

        return this.data?.defaultEnabled ?? true;

    }

    /**
     * Gets the emoji of the button
     * @returns {?String}
     */
    get emoji() {

        return this.data?.emoji ?? null;

    }

    /**
     * Gets the label of the button
     * @returns {String|string}
     */
    get label() {

        return this.data?.label ?? ' ';

    }

    /**
     * Gets the style of the button
     * @returns {?Discord.MessageButtonStyleResolvable}
     */
    get style() {

        return this.data?.style ?? null;

    }

    /**
     * Gets the url of the button
     * @returns {?String}
     */
    get url() {

        return this.data?.url ?? null;

    }

}

module.exports = ButtonInteraction;
const BaseInteraction = require('./BaseInteraction');
const Discord = require('discord.js');

/**
 * @typedef {Object} MenuInteractionData The raw data of the menu interaction
 * @property {String} name The name of the menu interaction
 * @property {?Boolean} enabled If the menu interaction is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?String} category The name of the category of the menu interaction (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the menu interaction (Default: 5)
 * @property {?String} customID The custom id of the menu interaction
 * @property {?Boolean} defaultEnabled If the menu interaction is enabled for @everyone (Default: true)
 * @property {?String} dirname The dirname of the menu interaction (Will be set automatically)
 * @property {?Boolean} ephemeral If the menu interaction is ephermeral reply only (Default: false)
 * @property {?String} location The location of the menu interaction (Will be set automatically)
 * @property {?Number} maxValues The max amount of options that can be selected (Default: 0)
 * @property {?Number} minValues The min amount of options that can be selected (Default: 1)
 * @property {?Array<Discord.MessageSelectOptionData>} options The options of the menu
 * @property {?String} placeholder The placeholder of the menu interaction
 * @property {?Boolean} betaOnly If the menu interaction is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the interaction can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the menu interaction is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the menu interaction is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the menu interaction is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the menu interaction is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the menu interaction is premium only (Default: false)
 * @property {?Boolean} nsfw If the menu interaction is nsfw (Default: false)
 */

/**
 * The menu interaction
 * @extends {BaseInteraction}
 */
class MenuInteraction extends BaseInteraction {

    /**
     * The constructor of the menu interaction
     * @param client {Discord.Client}
     * @param data {MenuInteractionData}
     */
    constructor(client, data) {

        super(client, data);

        /**
         * The raw data of the menu interaction
         * @type {MenuInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Gets the custom id of the menu interaction
     * @returns {?Discord.Snowflake|String}
     */
    get customID() {

        return this.data?.customID ?? ' ';

    }

    /**
     * Checks if the menu interaction is enabled for @everyone
     * @return {?Boolean}
     */
    get defaultEnabled() {

        return this.data?.defaultEnabled ?? true;

    }

    /**
     * Gets the max about of options that can be selected in the menu interaction
     * @returns {?Number}
     */
    get maxValues() {

        return this.data?.maxValues ?? 0;

    }

    /**
     * Gets the min about of options that can be selected in the menu interaction
     * @returns {?Number}
     */
    get minValues() {

        return this.data?.minValues ?? 1;

    }

    /**
     * Gets the options of the menu interaction
     * @returns {?Array<Discord.MessageSelectOptionData>|null}
     */
    get options() {

        return this.data?.options ?? null;

    }

    /**
     * Gets the placeholder of the menu interaction
     * @returns {?String}
     */
    get placeholder() {

        return this.data?.placeholder ?? ' ';

    }

    /**
     * Sets the id of the menu interaction
     * @param {Discord.Snowflake} id
     * @returns {MenuInteraction}
     * @private
     */
    setID(id) {

        this.data?.id === id;

        return this;

    }

}

module.exports = MenuInteraction;
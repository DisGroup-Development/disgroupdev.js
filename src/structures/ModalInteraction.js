const BaseInteraction = require('./BaseInteraction');
const Discord = require('discord.js');

/**
 * @typedef {Object} ModalInteractionData The raw data of the modal interaction
 * @property {String} name The name of the modal interaction
 * @property {?Boolean} enabled If the modal interaction is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?String} category The name of the category of the modal interaction (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the modal interaction (Default: 5)
 * @property {?String} customID The custom id of the modal interaction
 * @property {?String} dirname The dirname of the modal interaction (Will be set automatically)
 * @property {?Boolean} ephemeral If the modal interaction is ephermeral reply only (Default: false)
 * @property {?Array<Discord.ModalSelectOptionData>} fields The fields of the modal
 * @property {?String} location The location of the modal interaction (Will be set automatically)
 * @property {?Boolean} betaOnly If the modal interaction is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the interaction can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the modal interaction is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the modal interaction is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the modal interaction is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the modal interaction is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the modal interaction is premium only (Default: false)
 * @property {?Boolean} nsfw If the modal interaction is nsfw (Default: false)
 */

/**
 * The modal interaction
 * @extends {BaseInteraction}
 */
class ModalInteraction extends BaseInteraction {

    /**
     * The constructor of the modal interaction
     * @param client {Discord.Client}
     * @param manager {ModalInteractionManager}
     * @param data {ModalInteractionData}
     */
    constructor(client, manager, data = {}) {

        super(client, manager, data);

        /**
         * The raw data of the modal interaction
         * @type {ModalInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Gets the custom id of the modal interaction
     * @returns {?Discord.Snowflake|String}
     */
    get customID() {

        return this.data?.customID ?? ' ';

    }

    /**
     * Gets the fields of the modal interaction
     * @returns {?Array<Discord.ModalSelectOptionData>}
     */
    get fields() {

        return this.data?.fields ?? null;

    }

}

module.exports = ModalInteraction;
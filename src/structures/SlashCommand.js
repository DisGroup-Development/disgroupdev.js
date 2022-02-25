const BaseInteraction = require('./BaseInteraction');
const Discord = require('discord.js');

/**
 * @typedef {Object} SlashCommandData The raw data of the slash command
 * @property {String} name The name of the slash command
 * @property {String} description The description of the slash command
 * @property {?String} usage The usage of the slash command
 * @property {?Boolean} enabled If the slash command is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?Boolean} deployEnabled If the deploying of the slash command is enabled (Default: true)
 * @property {?Boolean} deployWithOptionsEnabled If the deploying of the slash command is with options enabled (Default: false)
 * @property {?Array<Discord.ApplicationCommandOptionData>} options The slash command options (Default: null)
 * @property {?String} category The name of the category of the slash command (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the slash command (Default: 5)
 * @property {?Boolean} defaultEnabled If the slash command is enabled for @everyone (Default: true)
 * @property {?String} dirname The dirname of the slash command (Will be set automatically)
 * @property {?Boolean} ephemeral If the slash command is ephermeral reply only (Default: false)
 * @property {?Discord.Snowflake} id The id of the slash command (Will be set automatically)
 * @property {?String} location The location of the slash command (Will be set automatically)
 * @property {?Boolean} betaOnly If the slash command is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the command can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the slash command is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the slash command is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the slash command is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the slash command is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the slash command is premium only (Default: false)
 * @property {?Boolean} nsfw If the slash command is nsfw (Default: false)
 */

/**
 * The slash command
 * @extends {BaseInteraction}
 */
class SlashCommand extends BaseInteraction {

    /**
     * The constructor of the slash command
     * @param client {Discord.Client}
     * @param data {SlashCommandData}
     */
    constructor(client, data = {}) {

        super(client, data);

        /**
         * The raw data of the slash command
         * @type {SlashCommandData}
         * @private
         */
        this.data = data;

    }

    /**
     * Checks if the slash command is enabled for @everyone
     * @return {?Boolean}
     */
    get defaultEnabled() {

        return this.data?.defaultEnabled ?? true;

    }

    /**
     * Checks if deploying is enabled for the slash command
     * @returns {Boolean}
     * @public
     */
    get deployEnabled() {

        return this.data?.deployEnabled ?? true;

    }

    /**
     * Checks if deploying with options is enabled for the slash command
     * @returns {Boolean}
     * @public
     */
    get deployWithOptionsEnabled() {

        return this.data?.deployWithOptionsEnabled ?? false;

    }

    /**
     * Gets the id of the slash command
     * @returns {?Discord.Snowflake|String}
     * @public
     */
    get id() {

        return this.data?.id ?? ' ';

    }

    /**
     * Gets the options of the slash command
     * @returns {Array<Discord.ApplicationCommandOptionData>}
     * @public
     */
    get options() {

        return this.data?.options ?? null;

    }

    /**
     * Sets the id of the slash command
     * @param {Discord.Snowflake} id
     * @returns {SlashCommand}
     * @private
     */
    setID(id) {

        this.data?.id === id;

        return this;

    }

}

module.exports = SlashCommand;
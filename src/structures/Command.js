const BaseCommand = require('./BaseCommand');
const Discord = require('discord.js');

/**
 * @typedef {Object} CommandData The raw data of the command
 * @property {String} name The name of the command
 * @property {String} description The description of the command
 * @property {?String} usage The usage of the command
 * @property {?Boolean} enabled If the command is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?String} category The name of the category of the command (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the command (Default: 5)
 * @property {?String} dirname The dirname of the command (Will be set automatically)
 * @property {?String} location The location of the command (Will be set automatically)
 * @property {?Boolean} betaOnly If the command is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the command can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the command is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the command is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the command is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the command is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the command is premium only (Default: false)
 * @property {?Boolean} nsfw If the command is nsfw (Default: false)
 */

/**
 * The command
 * @extends {BaseCommand}
 */
class Command extends BaseCommand {

    /**
     * The constructor of the command
     * @param client {Discord.Client}
     * @param manager {CommandManager}
     * @param data {CommandData}
     */
    constructor(client, manager, data = {}) {

        super(client, manager, data);

        /**
         * The raw data of the command
         * @type {CommandData}
         * @private
         */
        this.data = data;

    }

}

module.exports = Command;
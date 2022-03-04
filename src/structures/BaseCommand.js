const Base = require('./Base');
const Discord = require('discord.js');

/**
 * @typedef {Object} BaseCommandData The raw data of the base command
 * @property {String} name The name of the base command
 * @property {String} description The description of the base command
 * @property {?String} usage The usage of the base command
 * @property {?Boolean} enabled If the base command is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?String} category The name of the category of the base command (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the base command (Default: 5)
 * @property {?String} dirname The dirname of the base command (Will be set automatically)
 * @property {?String} location The location of the base command (Will be set automatically)
 * @property {?Boolean} betaOnly If the base command is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the base command can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the base command is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the base command is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the base command is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the base command is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the base command is premium only (Default: false)
 * @property {?Boolean} nsfw If the base command is nsfw (Default: false)
 */

/**
 * The base command
 * @extends {Base}
 */
class BaseCommand extends Base {

    /**
     * The constructor of the base command
     * @param client {Discord.Client}
     * @param manager {CommandManager}
     * @param data {BaseCommandData}
     */
    constructor(client, manager, data) {

        super(client);

        /**
         * A collection of all cooldowns
         * @type {Collection<Discord.Snowflake, Boolean>}
         * @private
         */
        this._cooldowns = new Discord.Collection();

        /**
         * The manager which manages this command
         * @type {CommandManager}
         * @private
         */
        this.manager = manager;

        /**
         * The raw data of the base  command
         * @type {BaseCommandData}
         * @private
         */
        this.data = data;

    }

    /**
     * Gets the category of the base command
     * @returns {String}
     * @public
     */
    get category() {

        return this.data?.category ?? ' ';

    }

    /**
     * Gets the client permission which the client needs to execute the base command
     * @returns {Array<Discord.PermissionResolvable>|*[]}
     * @public
     */
    get clientPermissions() {

        return this.data?.clientPermissions ?? [];

    }

    /**
     * Gets the cooldown in seconds of the base command
     * @return {Number}
     * @public
     */
    get cooldown() {

        return this.data?.cooldown ?? 5;

    }

    /**
     * Deletes the cooldown of a user for the base command
     * @param {Discord.UserResolvable} user The user of the cooldown
     * @return {Promise<Boolean>}
     * @public
     * @async
     */
    async deleteCooldown(user) {

        return new Promise(async (resolve, reject) => {

            const commandUser = await this.client.users.resolve(user);

            if(!commandUser) reject(false);

            const cooldown = this._cooldowns.get(commandUser.id);

            if(!cooldown) reject(false);

            resolve(true);

        });

    }

    /**
     * Gets the description of the base command
     * @returns {String}
     * @public
     */
    get description() {

        return this.data?.description ?? ' ';

    }

    /**
     * Gets the dirname of the base command
     * @returns {String}
     * @public
     */
    get dirname() {

        return this.data?.dirname ?? ' ';

    }

    /**
     * Checks if the base command is enabled
     * @returns {Boolean}
     * @public
     */
    get enabled() {

        return this.data?.enabled ?? true;

    }

    /**
     * Gets the cooldown of a user for the base command
     * @param {Discord.UserResolvable} user The user of the cooldown
     * @return {Promise<Boolean>}
     * @public
     * @async
     */
    async getCooldown(user) {

        return new Promise(async (resolve, reject) => {

            const commandUser = await this.client.users.resolve(user);

            if(!commandUser) reject(false);

            const cooldown = this._cooldowns.get(commandUser.id);

            if(!cooldown) reject(false);

            resolve(cooldown);

        });

    }

    /**
     * Checks if the base command is beta only
     * @returns {Boolean}
     * @public
     */
    get isBetaOnly() {

        return this.data?.betaOnly ?? false;

    }

    /**
     * Checks if the base command is guild channel only
     * @return {Array<Discord.TextBasedChannelTypes>|boolean}
     * @public
     */
    get isChannelOnly() {

        return this.data?.channelOnly ?? false;

    }

    /**
     * Checks if the base command is developer only
     * @return {?Boolean}
     * @public
     */
    get isDevOnly() {

        return this.data?.devOnly ?? false;

    }

    /**
     * Checks if the base command is developer guild only
     * @return {?Boolean}
     * @public
     */
    get isDevGuildOnly() {

        return this.data?.devGuildOnly ?? false;

    }

    /**
     * Checks if the base command is guild only
     * @return {?Boolean}
     * @public
     */
    get isGuildOnly() {

        return this.data?.guildOnly ?? true;

    }

    /**
     * Checks if the base command is nsfw
     * @return {?Boolean}
     * @public
     */
    get isNSFW() {

        return this.data?.nsfw ?? false;

    }

    /**
     * Checks if the base command is owner only
     * @return {?Boolean}
     * @public
     */
    get isOwnerOnly() {

        return this.data?.ownerOnly ?? true;

    }

    /**
     * Checks if the base command is premium only
     * @return {?Boolean}
     * @public
     */
    get isPremiumOnly() {

        return this.data?.premiumOnly ?? false;

    }

    /**
     * Gets the location of the base command
     * @returns {String}
     * @public
     */
    get location() {

        return this.data?.location ?? ' ';

    }

    /**
     * Gets the name of the base command
     * @returns {String}
     * @public
     */
    get name() {

        return this.data?.name ?? ' ';

    }

    /**
     * Reloads the base command
     * @return {Promise<Boolean|Error>|null}
     */
    reload() {

        return ( this.manager.has(this.name) ? this.manager.reload(this.name) : null );

    }

    /**
     * Sets the cooldown for the base command
     * @param {Discord.UserResolvable} user The user for the cooldown
     * @return {Promise<Boolean|Discord.Collection<Discord.Snowflake, Boolean>>}
     * @public
     * @async
     */
    async setCooldown(user) {

        return new Promise(async (resolve, reject) => {

            const commandUser = await this.client.users.resolve(user);

            if(!commandUser) reject(false);

            this._cooldowns.set(commandUser.id, true);

            setTimeout(() => {

                this.deleteCooldown(commandUser);

            }, this.cooldown * 1000);

            resolve(this._cooldowns);

        });

    }

    /**
     * Sets the location of the base command
     * @param {String} path The new path of the base command
     * @returns {String}
     * @public
     */
    setLocation(path) {

        this.data?.location === path;

        return this.data?.location;

    }

    /**
     * Unloads the base command
     * @return {Promise<Boolean|Error>|null}
     */
    unload() {

        return ( this.manager.has(this.name) ? this.manager.unload(this.name) : null );

    }

    /**
     * Gets the usage of the base command
     * @returns {String}
     * @public
     */
    get usage() {

        return this.data?.usage ?? ' ';

    }

    /**
     * Gets the user permission which the user needs to execute the base command
     * @returns {Array<Discord.PermissionResolvable>}
     * @public
     */
    get userPermissions() {

        return this.data?.userPermissions ?? [];

    }

}

module.exports = BaseCommand;
const Base = require('./Base');
const Discord = require('discord.js');

/**
 * @typedef {Object} BaseInteractionData The raw data of the base interaction
 * @property {String} name The name of the base interaction
 * @property {String} description The description of the base interaction
 * @property {?Boolean} enabled If the base interaction is enabled (Default: true)
 * @property {?Array<Discord.PermissionResolvable>} clientPermissions An array of all permission which the client needs (Default: [])
 * @property {?Array<Discord.PermissionResolvable>} userPermissions An array of all permission which the user needs (Default: [])
 * @property {?String} category The name of the category of the base interaction (Will be set automatically)
 * @property {?Number} cooldown The cooldown in seconds of the base interaction (Default: 5)
 * @property {?String} dirname The dirname of the base interaction (Will be set automatically)
 * @property {?Boolean} ephemeral If the base interaction is ephemeral reply only (Default: false)
 * @property {?String} location The location of the base interaction (Will be set automatically)
 * @property {?Boolean} betaOnly If the base interaction is beta only (Default: false)
 * @property {?Array<Discord.TextBasedChannelTypes>} channelOnly An array of all channels which the base interaction can be executed (Default: ALL)
 * @property {?Boolean} devOnly If the base interaction is developer only (Default: false)
 * @property {?Boolean} devGuildOnly If the base interaction is developer guild only (Default: false)
 * @property {?Boolean} guildOnly If the base interaction is guild only (Default: true)
 * @property {?Boolean} ownerOnly If the base interaction is premium only (Default: true)
 * @property {?Boolean} premiumOnly If the base interaction is premium only (Default: false)
 * @property {?Boolean} nsfw If the base interaction is nsfw (Default: false)
 */

/**
 * The base interaction
 * @extends {Base}
 */
class BaseInteraction extends Base {

    /**
     * The constructor of the base interaction
     * @param client {Discord.Client}
     * @param manager {ButtonInteractionManager|MenuInteractionManager|MessageInteractionManager|ModalInteractionManager|SlashCommandManager|UserInteractionManager}
     * @param data {BaseInteractionData}
     */
    constructor(client, manager, data) {

        super(client);

        /**
         * A collection of all cooldowns
         * @type {Discord.Collection<Discord.Snowflake, Boolean>}
         * @private
         */
        this._cooldowns = new Discord.Collection();

        /**
         * The manager which manages this interaction
         * @type {ButtonInteractionManager|MenuInteractionManager|MessageInteractionManager|ModalInteractionManager|SlashCommandManager|UserInteractionManager}
         * @private
         */
        this.manager = manager;

        /**
         * The raw data of the base interaction
         * @type {BaseInteractionData}
         * @private
         */
        this.data = data;

    }

    /**
     * Gets the category of the base interaction
     * @returns {String}
     * @public
     */
    get category() {

        return this.data?.category ?? ' ';

    }

    /**
     * Gets the client permission which the client needs to execute the base interaction
     * @returns {Array<Discord.PermissionResolvable>|*[]}
     * @public
     */
    get clientPermissions() {

        return this.data?.clientPermissions ?? [];

    }

    /**
     * Gets the cooldown in seconds of the base interaction
     * @return {Number}
     * @public
     */
    get cooldown() {

        return this.data?.cooldown ?? 5;

    }

    /**
     * Deletes the cooldown of a user for the base interaction
     * @param {Discord.UserResolvable} user The user of the interaction
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
     * Gets the description of the base interaction
     * @returns {String}
     * @public
     */
    get description() {

        return this.data?.description ?? ' ';

    }

    /**
     * Gets the dirname of the base interaction
     * @returns {String}
     * @public
     */
    get dirname() {

        return this.data?.dirname ?? ' ';

    }

    /**
     * Checks if the base interaction is enabled
     * @returns {Boolean}
     * @public
     */
    get enabled() {

        return this.data?.enabled ?? true;

    }

    /**
     * Checks if the base interaction is ephemeral reply only
     * @returns {Boolean}
     * @public
     */
    get ephemeral() {

        return this.data?.ephemeral ?? false;

    }

    /**
     * Checks if the command is executable
     * @param {Discord.Interaction} interaction The message which triggers the command
     * @returns {Boolean}
     */
    async executable(interaction) {

        if(!this.enabled) return false;
        if(this.isGuildOnly && !interaction?.guild?.available) return false;
        if(this.isNSFW && !interaction?.channel?.nsfw) return false;
        if(await this.getCooldown(interaction.user)) return false;
        if(!this.isChannelOnly !== 'ALL' && this.isChannelOnly.includes(interaction.channel.type)) return false;
        if(!interaction?.guild?.me?.permissions?.has(this.clientPermissions) || interaction?.guild?.me?.permissionsIn(interaction?.channel)?.has(this.clientPermissions)) return false;
        if(!interaction?.member?.permissions?.has(this.userPermissions) || !interaction?.memberPermissions?.has(this.clientPermissions)) return false;

        return true;

    }

    /**
     * Gets the cooldown of a user for the base interaction
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
     * Checks if the base interaction is beta only
     * @returns {Boolean}
     * @public
     */
    get isBetaOnly() {

        return this.data?.betaOnly ?? false;

    }

    /**
     * Checks if the base interaction is guild channel only
     * @return {Array<Discord.TextBasedChannelTypes>|String}
     * @public
     */
    get isChannelOnly() {

        return this.data?.channelOnly ?? 'ALL';

    }

    /**
     * Checks if the base interaction is developer only
     * @return {?Boolean}
     * @public
     */
    get isDevOnly() {

        return this.data?.devOnly ?? false;

    }

    /**
     * Checks if the base interaction is developer guild only
     * @return {?Boolean}
     * @public
     */
    get isDevGuildOnly() {

        return this.data?.devGuildOnly ?? false;

    }

    /**
     * Checks if the base interaction is guild only
     * @return {?Boolean}
     * @public
     */
    get isGuildOnly() {

        return this.data?.guildOnly ?? true;

    }

    /**
     * Checks if the base interaction is nsfw
     * @return {?Boolean}
     * @public
     */
    get isNSFW() {

        return this.data?.nsfw ?? false;

    }

    /**
     * Checks if the base interaction is owner only
     * @return {?Boolean}
     * @public
     */
    get isOwnerOnly() {

        return this.data?.ownerOnly ?? true;

    }

    /**
     * Checks if the base interaction is premium only
     * @return {?Boolean}
     * @public
     */
    get isPremiumOnly() {

        return this.data?.premiumOnly ?? false;

    }

    /**
     * Gets the location of the base interaction
     * @returns {String}
     * @public
     */
    get location() {

        return this.data?.location ?? ' ';

    }

    /**
     * Gets the name of the base interaction
     * @returns {String}
     * @public
     */
    get name() {

        return this.data?.name ?? ' ';

    }

    /**
     * Sets the cooldown for the base interaction
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
     * Sets the location of the base interaction
     * @param {String} path The new path of the base interaction
     * @returns {String}
     * @public
     */
    setLocation(path) {

        this.data.location = path;

        return this.location;

    }

    /**
     * Gets the usage of the base interaction
     * @returns {String}
     * @public
     */
    get usage() {

        return this.data?.usage ?? ' ';

    }

    /**
     * Gets the user permission which the user needs to execute the base interaction
     * @returns {Array<Discord.PermissionResolvable>}
     * @public
     */
    get userPermissions() {

        return this.data?.userPermissions ?? [];

    }

}

module.exports = BaseInteraction;
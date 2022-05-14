const { Client, Snowflake } = require('discord.js');
const EventEmitter = require('node:events');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * @typedef {Object} InteractionManagerOptions
 * @property {Snowflake[]} guildIDs The ids of the guild the commands should be deployed to
 * @property {?String} locationSlashCommands The location of the slash commands
 *
 */

/**
 * The interaction manager.
 * @extends {EventEmitter}
 * @class
 */
class InteractionManager extends EventEmitter {

    /**
     * The constructor of the interaction manager class.
     * @param {Client} client
     * @param {InteractionManagerOptions} options
     */
    constructor(client, options = {}) {

        super();

        /**
         * The client
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The options of the interaction manager
         * @type {InteractionManagerOptions}
         * @public
         */
        this.options = options;

        /**
         * The interaction manager for slash commands
         * @type {SlashCommandInteractionManager|null}
         * @public
         */
        this.slash = (this.options?.locationSlashCommands && typeof this.options?.locationSlashCommands === 'string') ? new SlashCommandInteractionManager(this.client, this) : null;

    }

}

module.exports = InteractionManager;
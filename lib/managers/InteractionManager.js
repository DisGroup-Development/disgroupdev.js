const { Client, Snowflake } = require('discord.js');
const EventEmitter = require('node:events');

const ButtonInteractionManager = require('./interaction/ButtonInteractionManager');
const ContextInteractionManager = require('./interaction/ContextInteractionManager');
const ModalInteractionManager = require('./interaction/ModalInteractionManager');
const SelectMenuInteractionManager = require('./interaction/SelectMenuInteractionManager');
const SlashCommandInteractionManager = require('./interaction/SlashCommandInteractionManager');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * @typedef {Object} InteractionManagerOptions
 * @property {Snowflake[]} guildIDs The ids of the guild the commands should be deployed to
 * @property {?String} locationButtonInteractions The location of the button interactions
 * @property {?String} locationContextInteractions The location of the context interactions
 * @property {?String} locationModalInteractions The location of the modal interactions
 * @property {?String} locationSelectMenuInteractions The location of the select menu interactions
 * @property {?String} locationSlashCommands The location of the slash commands
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
         * The interaction manager for button interactions
         * @type {ButtonInteractionManager|null}
         * @public
         */
        this.button = (this.options?.locationButtonInteractions && typeof this.options?.locationButtonInteractions === 'string') ? new ButtonInteractionManager(this.client, this) : null;

        /**
         * The interaction manager for context interactions
         * @type {ContextInteractionManager|null}
         * @public
         */
        this.context = (this.options?.locationContextInteractions && typeof this.options?.locationContextInteractions === 'string') ? new ContextInteractionManager(this.client, this) : null;

        /**
         * The interaction manager for modal interactions
         * @type {ModalInteractionManager|null}
         * @public
         */
        this.modal = (this.options?.locationModalInteractions && typeof this.options?.locationModalInteractions === 'string') ? new ModalInteractionManager(this.client, this) : null;

        /**
         * The interaction manager for button interactions
         * @type {SelectMenuInteractionManager|null}
         * @public
         */
        this.selectMenu = (this.options?.locationSelectMenuInteractions && typeof this.options?.locationSelectMenuInteractions === 'string') ? new SelectMenuInteractionManager(this.client, this) : null;

        /**
         * The interaction manager for slash commands
         * @type {SlashCommandInteractionManager|null}
         * @public
         */
        this.slash = (this.options?.locationSlashCommands && typeof this.options?.locationSlashCommands === 'string') ? new SlashCommandInteractionManager(this.client, this) : null;

    }

    /**
     * Deploys all interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    async deployAll() {

        try {

            await this.context.deployAll();
            await this.slash.deployAll();

            return true;

        } catch(e) {

            return new DisGroupDevError(e);

        }

    }

    /**
     * Loads all interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    async loadAll() {

        try {

            await this.button.loadAll();
            await this.context.loadAll();
            await this.modal.loadAll();
            await this.selectMenu.loadAll();
            await this.slash.loadAll();

            return true;

        } catch(e) {

            return new DisGroupDevError(e);

        }

    }

    /**
     * Reloads all interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    async reloadAll() {

        try {

            await this.button.reloadAll();
            await this.context.reloadAll();
            await this.modal.reloadAll();
            await this.selectMenu.reloadAll();
            await this.slash.reloadAll();

            return true;

        } catch(e) {

            return new DisGroupDevError(e);

        }

    }

    /**
     * Unloads all interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     */
    async unloadAll() {

        try {

            await this.button.unloadAll();
            await this.context.unloadAll();
            await this.modal.unloadAll();
            await this.selectMenu.unloadAll();
            await this.slash.unloadAll();

            return true;

        } catch(e) {

            return new DisGroupDevError(e);

        }

    }

}

module.exports = InteractionManager;
const Base = require('../structures/Base');
const ButtonInteractionManager = require('./ButtonInteractionManager');
const Discord = require('discord.js');
const FileSystem = require('node:fs');
const MenuInteractionManager = require('./MenuInteractionManager');
const MessageInteractionManager = require('./MessageInteractionManager');
const ModalInteractionManager = require('./ModalInteractionManager');
const SlashCommandManager = require('./SlashCommandManager');
const UserInteractionManager = require('./UserInteractionManager');
const Util = require('node:util');

/**
 * The options
 * @typedef {Object} InteractionManagerOptions
 * @property {Array<String>} guildIds An array of all guild ids for deploying interactions
 * @property {String} locationButtons The location of the button interactions
 * @property {String} locationMenus The location of the menu interactions
 * @property {String} locationMessages The location of the message interactions
 * @property {String} locationModals The location of the modal interactions
 * @property {String} locationSlashs The location of the slash interactions
 * @property {String} locationUsers The location of the user interactions
 */

/**
 * The interaction manager for handling interactions
 * @extends {Base}
 */
class InteractionManager extends Base {

    /**
     * The constructor for the InteractionManager
     * @param {Discord.Client} client 
     * @param {InteractionManagerOptions} options
     */
    constructor(client, options = {}) {

        super(client);

        /**
         * The collection of all interactions
         * @type {Discord.Collection<String, ButtonInteraction|MessageInteraction|SlashCommand|UserInteraction>}
         * @public
         */
        this._interactions = new Discord.Collection();

        /**
         * The ButtonInteractionManager
         * @type {ButtonInteractionManager}
         * @private
         */
        this._button = new ButtonInteractionManager(client, this);

        /**
         * The MenuInteractionManager
         * @type {MenuInteractionManager}
         * @private
         */
        this._menu = new MenuInteractionManager(client, this);

        /**
         * The MessageInteractionManager
         * @type {MessageInteractionManager}
         * @private
         */
        this._message = new MessageInteractionManager(client, this);

        /**
         * The ModalInteractionManager
         * @type {?ModalInteractionManager|null}
         * @private
         */
        this._modal = ( options?.locationModals ? new ModalInteractionManager(client, this) : null );

        /**
         * The SlashCommandManager
         * @type {?SlashCommandManager|null}
         * @private
         */
        this._slash = ( options?.locationSlashs ? new SlashCommandManager(client, this) : null );

        /**
         * The UserInteractionManager
         * @type {?UserInteractionManager|null}
         * @private
         */
        this._user = ( options?.locationUsers ? new UserInteractionManager(client, this) : null )

        /**
         * Reads a directory
         * @private
         */
        this.readDirectory = Util.promisify(FileSystem.readdir);

        /**
         * The options of the InteractionManager
         * @type {InteractionManagerOptions}
         * @public
         */
        this.options = options;

    }

    /**
     * The ButtonInteractionManager
     * @public
     * @returns {ButtonInteractionManager}
     */
    get buttons() {

        return this._button;

    }

    /**
     * Deploys all interactions
     * @public
     * @returns {Promise<Boolean | Error>}
     */
    deployAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this.messages.deployAll();
                await this.slashs.deployAll();
                await this.users.deployAll();

                resolve(true);

            } catch (e) {

                reject (e);

            }

        });

    }

    /**
     * Gets an interaction
     * @param {String} name The name of the interaction
     * @returns {?SlashCommand|null}
     */
    get(name) {

        const clientInteraction = this._interactions.get(name);

        return clientInteraction ?? null;

    }

    /**
     * Handles a raw data interaction
     * @param {*} rawData The raw data
     * @private
     * @returns {Boolean}
     */
    handle(rawData) {

        const handledPackage = this.client.ws.handlePacket(rawData);

        return handledPackage;

    }

    /**
     * Checks if there is any interaction with a specific name
     * @param {String} name The name of the interaction
     * @returns {Boolean}
     */
    has(name) {

        return this._interactions.has(name);

    }

    /**
     * Lists all interactions
     * @returns {(ButtonInteraction|MessageInteraction|SlashCommand|UserInteraction)[]}
     */
    list() {

        return this._interactions.toJSON();

    }

    /**
     * Loads all interactions
     * @public
     * @returns {Promise<Boolean | Error>}
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this.buttons.loadAll();
                await this.menus.loadAll();
                await this.messages.loadAll();
                await this.slashs.loadAll();
                await this.users.loadAll();

                resolve(true);

            } catch (e) {

                reject (e);

            }

        });

    }

    /**
     * The MenuInteractionManager
     * @public
     * @returns {MenuInteractionManager}
     */
    get menus() {

        return this._menu;

    }

    /**
     * The MessageInteractionManager
     * @public
     * @returns {?MessageInteractionManager|null}
     */
    get messages() {

        return this._message;

    }

    /**
     * The ModalInteractionManager
     * @return {?ModalInteractionManager|null}
     */
    get modal() {

        return this._modal;

    }

    /**
     * Reloads all interactions
     * @public
     * @returns {Promise<Boolean | Error>}
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this.buttons.reloadAll();
                await this.menus.reloadAll();
                await this.messages.reloadAll();
                await this.slashs.reloadAll();
                await this.users.reloadAll();

                resolve(true);

            } catch (e) {

                reject (e);

            }

        });

    }

    /**
     * Gets the size of all interactions
     * @returns {Number}
     */
    size() {

        return this._interactions.size;

    }

    /**
     * The SlashCommandManager
     * @public
     * @returns {?SlashCommandManager|null}
     */
    get slashs() {

        return this._slash;

    }

    /**
     * Unloads all interactions
     * @public
     * @returns {Promise<Boolean | Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this.buttons.unloadAll();
                await this.menus.unloadAll();
                await this.messages.unloadAll();
                await this.slashs.unloadAll();
                await this.users.unloadAll();

                resolve(true);

            } catch (e) {

                reject (e);

            }

        });

    }

    /**
     * The UserInteractionManager
     * @public
     * @returns {?UserInteractionManager|null}
     */
    get users() {

        return this._user;

    }

}

module.exports = InteractionManager;
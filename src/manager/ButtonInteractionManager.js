const Base = require('../structures/Base');
const ButtonInteraction = require('../structures/ButtonInteraction');
const Errors = require('../utils/Errors');
const Discord = require('discord.js');

/**
 * The button interaction manager for handling button interactions
 * @extends {Base}
 */
class ButtonInteractionManager extends Base {

    constructor(client, interactionManager) {

        super(client);

        /**
         * The interaction manager
         * @type {InteractionManager}
         * @public
         */
        this.manager = interactionManager;

        /**
         * A collection of all button interactions
         * @type {Discord.Collection<String, ButtonInteraction>}
         * @private
         */
        this._buttonInteractions = new Discord.Collection();

    }

    /**
     * Load a specific button interaction
     * @param {String} name The name of the button interaction
     * @param {String} path The path of the button interaction
     * @returns {Promise<Boolean|Error>}
     */
    load(name, path) {

        return new Promise(async (resolve, reject) => {

            try {

                /**
                 * @type {ButtonInteraction}
                 */
                const buttonInteractionFile = new(require(path))(this.client);

                buttonInteractionFile.setLocation(path);

                if(buttonInteractionFile?.init && typeof buttonInteractionFile?.init === 'function') buttonInteractionFile.init();

                this._buttonInteractions.set(buttonInteractionFile.name, buttonInteractionFile);
                this.manager._interactions.set(buttonInteractionFile.name, buttonInteractionFile);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Loads all button interactions
     * @return {Promise<Boolean|Error>}
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const buttonInteractionDir = await this.manager.readDirectory(this.manager.options.locationbuttons);

                try {

                    for(const buttonInteractionCategoryDir of buttonInteractionDir) {

                        const buttonInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationbuttons}/${buttonInteractionCategoryDir}`);

                        for(const buttonInteractionFile of buttonInteractionFiles) {

                            this.load(buttonInteractionFile, `${this.manager.options.locationbuttons}/${buttonInteractionFile}`);

                        }

                    }

                    resolve(true);

                } catch (e) {

                    reject(e);

                }

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads a specific button interactions
     * @param {String} name The name of the button interaction
     * @return {Promise<Boolean|Error>}
     */
    reload(name) {

        const clientButtonInteraction = this._buttonInteractions.get(name);

        if(!clientButtonInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                await this.unload(name);

                resolve(await this.load(name, clientButtonInteraction?.location))

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads all button interactions
     * @return {Promise<Boolean|Error>}
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this.unloadAll();

                resolve(await this.loadAll())

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Gets the size of all button interactions
     * @returns {Number}
     */
    size() {

        return this._buttonInteractions.size;

    }

    /**
     * Unloads a specific button interactions
     * @param {String} name The name of the button interaction
     * @return {Promise<Boolean|Error>}
     */
    unload(name) {

        const clientCommand = this._buttonInteractions.get(name);

        if(!clientCommand) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                delete require.cache[require.resolve(clientCommand?.location)];

                this._buttonInteractions.delete(name);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Unload all button interactions
     * @return {Promise<Boolean|Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const buttonInteractionDir = await this.manager.readDirectory(this.manager.options.locationbuttons);

                try {

                    for(const buttonInteractionCategoryDir of buttonInteractionDir) {

                        const buttonInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationbuttons}/${buttonInteractionCategoryDir}`);

                        for(const buttonInteractionFile of buttonInteractionFiles) {

                            if(!this._buttonInteractions.has(buttonInteractionFile)) return;

                            this.unload(buttonInteractionFile);

                        }

                    }

                    resolve(true);

                } catch (e) {

                    reject(e);

                }

            } catch (e) {

                reject(e);

            }

        });

    }

}

module.exports = ButtonInteractionManager;
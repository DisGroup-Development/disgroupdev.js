const Base = require('../structures/Base');
const Discord = require('discord.js');
const Errors = require('../utils/Errors');

/**
 * The modal interaction manager for handling modal interactions
 * @extends {Base}
 */
class ModalInteractionManager extends Base {

    /**
     * The constructor for the ModalInteractionManager
     * @param {Discord.Client} client
     * @param {InteractionManager} interactionManager
     */
    constructor(client, interactionManager) {

        super(client);

        /**
         * The interaction manager
         * @type {InteractionManager}
         * @public
         */
        this.manager = interactionManager;

        /**
         * A collection of all modal interactions
         * @type {Discord.Collection<String, modalInteraction>}
         * @private
         */
        this._modalInteractions = new Discord.Collection();

    }

    /**
     * Load a specific modal interaction
     * @param {String} path The path of the modal interaction
     * @returns {Promise<Boolean|Error>}
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /**
                 * @type {ModalInteraction}
                 */
                const modalInteractionFile = new(require(path))(this.client, this.manager);

                modalInteractionFile.setLocation(path);

                if(modalInteractionFile?.init && typeof modalInteractionFile?.init === 'function') modalInteractionFile.init();

                this._modalInteractions.set(modalInteractionFile.name, modalInteractionFile);
                this.manager._interactions.set(modalInteractionFile.name, modalInteractionFile);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Loads all modal interactions
     * @return {Promise<Boolean|Error>}
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const modalInteractionDir = await this.manager.readDirectory(this.manager.options.locationModals);

                try {

                    for(const modalInteractionCategoryDir of modalInteractionDir) {

                        const modalInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationModals}/${modalInteractionCategoryDir}`);

                        for(const modalInteractionFile of modalInteractionFiles) {

                            await this.load(`${this.manager.options.locationModals}/${modalInteractionCategoryDir}/${modalInteractionFile}`);

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
     * Reloads a specific modal interactions
     * @param {String} name The name of the modal interaction
     * @return {Promise<Boolean|Error>}
     */
    reload(name) {

        const clientModalInteraction = this._modalInteractions.get(name);

        if(!clientModalInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                await this.unload(name);

                resolve(await this.load(clientModalInteraction?.location))

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads all modal interactions
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
     * Gets the size of all modal interactions
     * @returns {Number}
     */
    size() {

        return this._modalInteractions.size;

    }

    /**
     * Unloads a specific modal interactions
     * @param {String} name The name of the modal interaction
     * @return {Promise<Boolean|Error>}
     */
    unload(name) {

        const clientmodalInteraction = this._modalInteractions.get(name);

        if(!clientmodalInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                delete require.cache[require.resolve(clientmodalInteraction?.location)];

                this._modalInteractions.delete(name);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Unload all modal interactions
     * @return {Promise<Boolean|Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const modalInteractionDir = await this.manager.readDirectory(this.manager.options.locationModals);

                try {

                    for(const modalInteractionCategoryDir of modalInteractionDir) {

                        const modalInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationModals}/${modalInteractionCategoryDir}`);

                        for(const modalInteractionFile of modalInteractionFiles) {

                            if(!this._modalInteractions.has(modalInteractionFile)) return;

                            await this.unload(modalInteractionFile);

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

module.exports = ModalInteractionManager;
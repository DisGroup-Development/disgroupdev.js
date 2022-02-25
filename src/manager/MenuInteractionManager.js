const Base = require('../structures/Base');
const Discord = require('discord.js');
const Errors = require('../utils/Errors');

/**
 * The menu interaction manager for handling menu interactions
 * @extends {Base}
 */
class MenuInteractionManager extends Base {

    /**
     * The constructor for the MenuInteractionManager
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
         * A collection of all menu interactions
         * @type {Discord.Collection<String, MenuInteraction>}
         * @private
         */
        this._menuInteractions = new Discord.Collection();

    }

    /**
     * Load a specific menu interaction
     * @param {String} path The path of the menu interaction
     * @returns {Promise<Boolean|Error>}
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /**
                 * @type {MenuInteraction}
                 */
                const menuInteractionFile = new(require(path))(this.client);

                menuInteractionFile.setLocation(path);

                if(menuInteractionFile?.init && typeof menuInteractionFile?.init === 'function') menuInteractionFile.init();

                this._menuInteractions.set(menuInteractionFile.name, menuInteractionFile);
                this.manager._interactions.set(menuInteractionFile.name, menuInteractionFile);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Loads all menu interactions
     * @return {Promise<Boolean|Error>}
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const menuInteractionDir = await this.manager.readDirectory(this.manager.options.locationMenus);

                try {

                    for(const menuInteractionCategoryDir of menuInteractionDir) {

                        const menuInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationMenus}/${menuInteractionCategoryDir}`);

                        for(const menuInteractionFile of menuInteractionFiles) {

                            await this.load(`${this.manager.options.locationMenus}/${menuInteractionCategoryDir}/${menuInteractionFile}`);

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
     * Reloads a specific menu interactions
     * @param {String} name The name of the menu interaction
     * @return {Promise<Boolean|Error>}
     */
    reload(name) {

        const clientMenuInteraction = this._menuInteractions.get(name);

        if(!clientMenuInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                await this.unload(name);

                resolve(await this.load(clientMenuInteraction?.location))

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads all menu interactions
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
     * Gets the size of all menu interactions
     * @returns {Number}
     */
    size() {

        return this._menuInteractions.size;

    }

    /**
     * Unloads a specific menu interactions
     * @param {String} name The name of the menu interaction
     * @return {Promise<Boolean|Error>}
     */
    unload(name) {

        const clientMenuInteraction = this._menuInteractions.get(name);

        if(!clientMenuInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                delete require.cache[require.resolve(clientMenuInteraction?.location)];

                this._menuInteractions.delete(name);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Unload all menu interactions
     * @return {Promise<Boolean|Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const menuInteractionDir = await this.manager.readDirectory(this.manager.options.locationMenus);

                try {

                    for(const menuInteractionCategoryDir of menuInteractionDir) {

                        const menuInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationMenus}/${menuInteractionCategoryDir}`);

                        for(const menuInteractionFile of menuInteractionFiles) {

                            if(!this._menuInteractions.has(menuInteractionFile)) return;

                            await this.unload(menuInteractionFile);

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

module.exports = MenuInteractionManager;
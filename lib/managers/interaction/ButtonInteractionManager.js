'use strict';

const readDirectory = require('node:util').promisify(require('node:fs').readdir);
const statDirectory = require('node:util').promisify(require('node:fs').stat);
const { Collection } = require('discord.js');
const { DisGroupDevError, Messages } = require('../../errors/DisGroupDevError');


/**
 * The button interaction manager.
 * @class
 */
class ButtonInteractionManager {
    constructor(client, interactionManager) {
        /**
         * The cache with all button interactions
         * @type {Collection<String, ButtonInteraction>}
         * @public
         */
        this.cache = new Collection();

        /**
         * The client
         * @type {Client}
         * @public
         */
        this.client = client;

        /**
         * The interaction manager
         * @type {InteractionManager}
         * @public
         */
        this.manager = interactionManager;
    }

    /**
     * Loads one specific button interaction
     * @param {String} path The path to the button interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load(path) {
        return new Promise((resolve, reject) => {
            try {
                /** @type {ButtonInteraction} */
                const buttonInteraction = new (require(path))(this.client, this.manager);

                if (!buttonInteraction.enabled) return;

                buttonInteraction.location = path;

                if (buttonInteraction.init && typeof buttonInteraction.init === 'function') buttonInteraction.init();
                if (!buttonInteraction.execute || typeof buttonInteraction.execute !== 'function') reject(new DisGroupDevError(Messages.INVALID_EXECUTE(buttonInteraction.name)));

                this.cache.set(buttonInteraction.name, buttonInteraction);

                /**
                 * Emitted when a button interaction is loaded.
                 * @event InteractionManager#buttonInteractionLoad
                 * @param {ButtonInteraction} buttonInteraction The button interaction
                 * @public
                 */
                this.manager.emit('buttonInteractionLoad', buttonInteraction);

                resolve(true);
            } catch (e) {
                throw new DisGroupDevError(e);
            }
        });
    }

    /**
     * Loads all button interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    loadAll() {
        return new Promise(async resolve => {
            try {
                const buttonInteractionDirectory = await readDirectory(this.manager.options.locationButtonInteractions);

                for (const buttonInteractionDirectoryCategoryOrFile of buttonInteractionDirectory) {
                    const buttonInteractionDirectoryStat = await statDirectory(require('node:path').resolve(this.manager.options.locationButtonInteractions, buttonInteractionDirectoryCategoryOrFile));

                    if (buttonInteractionDirectoryStat.isDirectory()) {
                        const buttonInteractionDirectoryCategory = await readDirectory(require('node:path').resolve(this.manager.options.locationButtonInteractions, buttonInteractionDirectoryCategoryOrFile));

                        for (const buttonInteractionDirectoryCategoryFile of buttonInteractionDirectoryCategory) {
                            await this.load(`${this.manager.options.locationButtonInteractions}/${buttonInteractionDirectoryCategoryOrFile}/${buttonInteractionDirectoryCategoryFile}`);
                        }
                    } else if (buttonInteractionDirectoryStat.isFile()) {
                        await this.load(`${this.manager.options.locationButtonInteractions}/${buttonInteractionDirectoryCategoryOrFile}`);
                    }
                }

                resolve(true);
            } catch (e) {
                throw new DisGroupDevError(e);
            }
        });
    }

    /**
     * Reloads one specific button interaction
     * @param {String} name The name of the button interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload(name) {
        return new Promise(async (resolve, reject) => {
            if (!this.cache.has(name)) reject(new DisGroupDevError(Messages.BUTTON_INTERACTION_NOT_FOUND(name)));

            const { location } = require(this.cache.get(name));

            try {
                await this.unload(name);
                await this.load(location);

                const buttonInteraction = this.cache.get(name);

                /**
                 * Emitted when a button interaction is reloaded.
                 * @event InteractionManager#buttonInteractionReload
                 * @param {ButtonInteraction} buttonInteraction The button interaction
                 * @public
                 */
                this.manager.emit('buttonInteractionReload', buttonInteraction);

                resolve(true);
            } catch (e) {
                throw new DisGroupDevError(e);
            }
        });
    }

    /**
     * Reloads all button interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reloadAll() {
        return new Promise(async resolve => {
            try {
                for (const buttonInteraction of this.cache) {
                    await this.unload(buttonInteraction[1].name);
                }

                await this.loadAll();

                resolve(true);
            } catch (e) {
                throw new DisGroupDevError(e);
            }
        });
    }

    /**
     * Unloads one specific button interaction
     * @param {String} name The name of the button interaction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload(name) {
        return new Promise((resolve, reject) => {
            if (!this.cache.has(name)) reject(new DisGroupDevError(Messages.BUTTON_INTERACTION_NOT_FOUND(name)));

            try {
                delete require.cache[require.resolve(this.cache.get(name).location)];

                this.cache.delete(name);

                /**
                 * Emitted when a button interaction is unloaded.
                 * @event InteractionManager#buttonInteractionUnload
                 * @param {String} name The name of the button interaction
                 * @public
                 */
                this.manager.emit('buttonInteractionUnload', name);

                resolve(true);
            } catch (e) {
                throw new DisGroupDevError(e);
            }
        });
    }

    /**
     * Unloads all button interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unloadAll() {
        return new Promise(async resolve => {
            try {
                for (const buttonInteraction of this.cache) {
                    await this.unload(buttonInteraction[1].name);
                }

                resolve(true);
            } catch (e) {
                throw new DisGroupDevError(e);
            }
        });
    }
}

module.exports = ButtonInteractionManager;

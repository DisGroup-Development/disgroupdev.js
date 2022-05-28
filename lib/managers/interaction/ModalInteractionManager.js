const { Client, Collection, Guild } = require('discord.js');
const ModalInteraction = require('../../structures/interaction/ModalInteraction');

const { DisGroupDevError, Messages } = require('../../errors/DisGroupDevError');

const readDirectory = require('node:util').promisify(require('node:fs').readdir);
const statDirectory = require('node:util').promisify(require('node:fs').stat);

/**
 * The modal interaction manager.
 * @class
 */
class ModalInteractionManager {

    /**
     * The constructor of the modal interaction manager class.
     * @param {Client} client
     * @param {InteractionManager} interactionManager
     */
    constructor(client, interactionManager) {

        /**
         * The cache with all modal interactions
         * @type {Collection<String, ModalInteraction>}
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
     * Loads one specific modal interaction
     * @param {String} path
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /** @type {ModalInteraction} */
                const modalInteraction = new(require(path))(this.client, this.manager);

                modalInteraction.location = path;

                if(modalInteraction.init && typeof modalInteraction.init === 'function') modalInteraction.init();
                if(!modalInteraction.execute || typeof modalInteraction.execute !== 'function') reject(new DisGroupDevError(Messages.INVALID_EXECUTE(modalInteraction.name)));

                this.cache.set(modalInteraction.name, modalInteraction);

                /**
                 * Emitted when a modal interaction is loaded.
                 * @event InteractionManager#modalInteractionLoad
                 * @param {ModalInteraction} modalInteraction The modal interaction
                 * @public
                 */
                this.manager.emit('modalInteractionLoad', modalInteraction);

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads all modal interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const modalInteractionDirectory = await readDirectory(this.manager.options.locationModalInteractions);

                for(const modalInteractionDirectoryCategoryOrFile of modalInteractionDirectory) {

                    const modalInteractionDirectoryStat = await statDirectory(require('node:path').resolve(this.manager.options.locationModalInteractions, modalInteractionDirectoryCategoryOrFile));

                    if(modalInteractionDirectoryStat.isDirectory()) {

                        const modalInteractionDirectoryCategory = await readDirectory(require('node:paht').resolve(this.manager.options.locationModalInteractions, modalInteractionDirectoryCategoryOrFile));

                        for(const modalInteractionDirectoryCategoryFile of modalInteractionDirectoryCategory) {

                            await this.load(`${this.manager.options.locationModalInteractions}/${modalInteractionDirectoryCategoryOrFile}/${modalInteractionDirectoryCategoryFile}`);

                        }

                    } else if(modalInteractionDirectoryStat.isFile()) {

                        await this.load(`${this.manager.options.locationModalInteractions}/${modalInteractionDirectoryCategoryOrFile}`);

                    }

                }

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads one specific modal interaction
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) reject(new DisGroupDevError(Messages.MODAL_INTERACTION_NOT_FOUND(name)));

            const { location } = require(this.cache.get(name));

            try {

                await this.unload(name);
                await this.load(location);

                const modalInteraction = this.cache.get(name);

                /**
                 * Emitted when a modal interaction is reloaded.
                 * @event InteractionManager#modalInteractionReload
                 * @param {ModalInteraction} modalInteraction The modal interaction
                 * @public
                 */
                this.manager.emit('modalInteractionReload', modalInteraction);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads all modal interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const modalInteraction of this.cache) {

                    await this.unload(modalInteraction.name);

                }

                await this.loadAll();

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads one specific modal interaction
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) reject(new DisGroupDevError(Messages.MODAL_INTERACTION_NOT_FOUND(name)));

            try {

                delete require.cache[require.resolve(this.cache.get(name).location)];

                this.cache.delete(name);

                /**
                 * Emitted when a modal interaction is unloaded.
                 * @event InteractionManager#modalInteractionUnload
                 * @param {String} name The name of the modal interaction
                 * @public
                 */
                this.manager.emit('modalInteractionUnload', name);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads all modal interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const modalInteraction of this.cache) {

                    await this.unload(modalInteraction.name);

                }

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

}

module.exports = ModalInteractionManager;
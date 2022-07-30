const { Client, Collection } = require('discord.js');
const SelectMenuInteraction = require('../../structures/interaction/SelectMenuInteraction');

const { DisGroupDevError, Messages } = require('../../errors/DisGroupDevError');

const readDirectory = require('node:util').promisify(require('node:fs').readdir);
const statDirectory = require('node:util').promisify(require('node:fs').stat);

/**
 * The select menu interaction manager.
 * @class
 */
class SelectMenuInteractionManager {

    /**
     * The constructor of the select menu interaction manager class.
     * @param {Client} client
     * @param {InteractionManager} interactionManager
     */
    constructor(client, interactionManager) {

        /**
         * The cache with all select menu interactions
         * @type {Collection<String, SelectMenuInteraction>}
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
     * Loads one specific select menu interaction
     * @param {String} path
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /** @type {SelectMenuInteraction} */
                const selectMenuInteraction = new(require(path))(this.client, this.manager);

                if(!selectMenuInteraction.enabled) reject(Messages.INTERACTION_NOT_ENABLED);

                selectMenuInteraction.location = path;

                if(selectMenuInteraction.init && typeof selectMenuInteraction.init === 'function') selectMenuInteraction.init();
                if(!selectMenuInteraction.execute || typeof selectMenuInteraction.execute !== 'function') reject(new DisGroupDevError(Messages.INVALID_EXECUTE(selectMenuInteraction.name)));

                this.cache.set(selectMenuInteraction.name, selectMenuInteraction);

                /**
                 * Emitted when a select menu interaction is loaded.
                 * @event InteractionManager#selectMenuInteractionLoad
                 * @param {SelectMenuInteraction} selectMenuInteraction The select menu interaction
                 * @public
                 */
                this.manager.emit('selectMenuInteractionLoad', selectMenuInteraction);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads all select menu interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const selectMenuInteractionDirectory = await readDirectory(this.manager.options.locationSelectMenuInteractions);

                for(const selectMenuInteractionDirectoryCategoryOrFile of selectMenuInteractionDirectory) {

                    const selectMenuInteractionDirectoryStat = await statDirectory(require('node:path').resolve(this.manager.options.locationSelectMenuInteractions, selectMenuInteractionDirectoryCategoryOrFile));

                    if(selectMenuInteractionDirectoryStat.isDirectory()) {

                        const selectMenuInteractionDirectoryCategory = await readDirectory(require('node:path').resolve(this.manager.options.locationSelectMenuInteractions, selectMenuInteractionDirectoryCategoryOrFile));

                        for(const selectMenuInteractionDirectoryCategoryFile of selectMenuInteractionDirectoryCategory) {

                            await this.load(`${this.manager.options.locationSelectMenuInteractions}/${selectMenuInteractionDirectoryCategoryOrFile}/${selectMenuInteractionDirectoryCategoryFile}`);

                        }

                    } else if(selectMenuInteractionDirectoryStat.isFile()) {

                        await this.load(`${this.manager.options.locationSelectMenuInteractions}/${selectMenuInteractionDirectoryCategoryOrFile}`);

                    }

                }

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads one specific select menu interaction
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) reject(new DisGroupDevError(Messages.SELECT_MENU_INTERACTION_NOT_FOUND(name)));

            const { location } = require(this.cache.get(name));

            try {

                await this.unload(name);
                await this.load(location);

                const selectMenuInteraction = this.cache.get(name);

                /**
                 * Emitted when a select menu interaction is reloaded.
                 * @event InteractionManager#selectMenuInteractionReload
                 * @param {SelectMenuInteraction} selectMenuInteraction The select menu interaction
                 * @public
                 */
                this.manager.emit('selectMenuInteractionReload', selectMenuInteraction);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads all select menu interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const selectMenuInteraction of this.cache) {

                    await this.unload(selectMenuInteraction[1].name);

                }

                await this.loadAll();

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads one specific select menu interaction
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) reject(new DisGroupDevError(Messages.SELECT_MENU_INTERACTION_NOT_FOUND(name)));

            try {

                delete require.cache[require.resolve(this.cache.get(name).location)];

                this.cache.delete(name);

                /**
                 * Emitted when a select menu interaction is unloaded.
                 * @event InteractionManager#selectMenuInteractionUnload
                 * @param {String} name The name of the select menu interaction
                 * @public
                 */
                this.manager.emit('selectMenuInteractionUnload', name);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads all select menu interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const selectMenuInteraction of this.cache) {

                    await this.unload(selectMenuInteraction[1].name);

                }

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

}

module.exports = SelectMenuInteractionManager;
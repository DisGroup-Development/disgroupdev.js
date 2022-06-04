const { Client, Collection, Guild } = require('discord.js');
const ContextInteraction = require('../../structures/interaction/ContextInteraction');

const { DisGroupDevError, Messages } = require('../../errors/DisGroupDevError');

const readDirectory = require('node:util').promisify(require('node:fs').readdir);
const statDirectory = require('node:util').promisify(require('node:fs').stat);

/**
 * The context interaction manager.
 * @class
 */
class ContextInteractionManager {

    /**
     * The constructor of the context interaction manager class.
     * @param {Client} client
     * @param {InteractionManager} interactionManager
     */
    constructor(client, interactionManager) {

        /**
         * The cache with all context interactions
         * @type {Collection<String, ContextInteraction>}
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
     * Deploys one specific context interaction
     * @param {ContextInteraction} contextInteraction
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    deploy(contextInteraction) {

        return new Promise(async (resolve, reject) => {

            if(!contextInteraction instanceof ContextInteraction) reject(new DisGroupDevError(Messages.NOT_INSTANCE_OF(contextInteraction, ContextInteraction)));
            if(!contextInteraction.deployEnabled) reject(new DisGroupDevError(Messages.NOT_ENABLED));

            try {

                /** @type {Guild[]} */
                let guilds = [];

                for(const guildId of this.manager.options.guildIDs) {

                    const guild = this.client.guilds.resolve(guildId);

                    if(!guild || !guild instanceof Guild) reject(new DisGroupDevError(Messages.UNRESOLVABLE_GUILD(guildId)));

                    guilds.push(guild);

                }

                if(contextInteraction.guildOnly) {

                    for(const guild of guilds) {

                        const guildCommand = await guild.commands.create({ name: contextInteraction.name, nameLocalizations: contextInteraction.nameLocalizations, type: contextInteraction.type, defaultPermission: contextInteraction.defaultEnabled });

                        contextInteraction.id = guildCommand.id;

                        /**
                         * Emitted when a context interaction is deployed.
                         * @event InteractionManager#contextInteractionDeploy
                         * @param {ContextInteraction} contextInteraction The context interaction
                         * @public
                         */
                        this.manager.emit('contextInteractionDeploy', contextInteraction);

                    }

                } else {

                    const applicationCommand = await this.client.application.commands.create({ name: contextInteraction.name, nameLocalizations: contextInteraction.nameLocalizations, type: contextInteraction.type, defaultPermission: contextInteraction.defaultEnabled });

                    contextInteraction.id = applicationCommand.id;

                    /**
                     * Emitted when a context interaction is deployed.
                     * @event InteractionManager#contextInteractionDeploy
                     * @param {ContextInteraction} contextInteraction The context interaction
                     * @public
                     */
                    this.manager.emit('contextInteractionDeploy', contextInteraction);

                }

            } catch(e) {

                reject(new DisGroupDevError(e));

            }


        });

    }


    /**
     * Deploys all context interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    deployAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const contextInteraction of this.cache) {

                    await this.deploy(contextInteraction);

                }

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads one specific context interaction
     * @param {String} path
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /** @type {ContextInteraction} */
                const contextInteraction = new(require(path))(this.client, this.manager);

                if(!contextInteraction.enabled) reject(Messages.INTERACTION_NOT_ENABLED);

                contextInteraction.location = path;

                if(contextInteraction.init && typeof contextInteraction.init === 'function') contextInteraction.init();
                if(!contextInteraction.execute || typeof contextInteraction.execute !== 'function') reject(new DisGroupDevError(Messages.INVALID_EXECUTE(contextInteraction.name)));

                this.cache.set(contextInteraction.name, contextInteraction);

                /**
                 * Emitted when a context interaction is loaded.
                 * @event InteractionManager#contextInteractionLoad
                 * @param {ContextInteraction} contextInteraction The context interaction
                 * @public
                 */
                this.manager.emit('contextInteractionLoad', contextInteraction);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads all context interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const contextInteractionDirectory = await readDirectory(this.manager.options.locationContextInteractions);

                for(const contextInteractionDirectoryCategoryOrFile of contextInteractionDirectory) {

                    const contextInteractionDirectoryStat = await statDirectory(require('node:path').resolve(this.manager.options.locationContextInteractions, contextInteractionDirectoryCategoryOrFile));

                    if(contextInteractionDirectoryStat.isDirectory()) {

                        const contextInteractionDirectoryCategory = await readDirectory(require('node:path').resolve(this.manager.options.locationContextInteractions, contextInteractionDirectoryCategoryOrFile));

                        for(const contextInteractionDirectoryCategoryFile of contextInteractionDirectoryCategory) {

                            await this.load(`${this.manager.options.locationContextInteractions}/${contextInteractionDirectoryCategoryOrFile}/${contextInteractionDirectoryCategoryFile}`);

                        }

                    } else if(contextInteractionDirectoryStat.isFile()) {

                        await this.load(`${this.manager.options.locationContextInteractions}/${contextInteractionDirectoryCategoryOrFile}`);

                    }

                }

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads one specific context interaction
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) reject(new DisGroupDevError(Messages.CONTEXT_INTERACTION_NOT_FOUND(name)));

            const { location } = require(this.cache.get(name));

            try {

                await this.unload(name);
                await this.load(location);

                const contextInteraction = this.cache.get(name);

                /**
                 * Emitted when a context interaction is reloaded.
                 * @event InteractionManager#contextInteractionReload
                 * @param {ContextInteraction} contextInteraction The context interaction
                 * @public
                 */
                this.manager.emit('contextInteractionReload', contextInteraction);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads all context interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const contextInteraction of this.cache) {

                    await this.unload(contextInteraction[1].name);

                }

                await this.loadAll();

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads one specific context interaction
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) reject(new DisGroupDevError(Messages.CONTEXT_INTERACTION_NOT_FOUND(name)));

            try {

                delete require.cache[require.resolve(this.cache.get(name).location)];

                this.cache.delete(name);

                /**
                 * Emitted when a context interaction is unloaded.
                 * @event InteractionManager#contextInteractionUnload
                 * @param {String} name The name of the context interaction
                 * @public
                 */
                this.manager.emit('contextInteractionUnload', name);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads all context interactions
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const contextInteraction of this.cache) {

                    await this.unload(contextInteraction[1].name);

                }

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

}

module.exports = ContextInteractionManager;
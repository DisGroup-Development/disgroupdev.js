const Base = require('../structures/Base');
const Discord = require('discord.js');
const Errors = require('../utils/Errors');
const UserInteraction = require('../structures/UserInteraction');

/**
 * The user interaction manager for handling user interactions
 * @extends {Base}
 */
class UserInteractionManager extends Base {

    /**
     * The constructor for the UserInteractionManager
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
         * A collection of all user interactions
         * @type {Discord.Collection<String, UserInteraction>}
         * @private
         */
        this._userInteractions = new Discord.Collection();

    }

    /**
     * Deploys a specific user interaction
     * @param {UserInteraction} userInteraction
     * @returns {Promise<Boolean|Error>}
     */
    deploy(userInteraction) {

        if(!userInteraction instanceof UserInteraction) throw new Error(Errors.COMMAND_NOT_A_SLASH_COMMAND_OBJECT);

        return new Promise(async (resolve, reject) => {

            try {

                if(!userInteraction.deployEnabled) reject(Errors.COMMAND_NOT_ENABLED_FOR_DEPLOYING);

                /**
                 * @type {Array<Discord.Guild>|[]}
                 */
                const guilds = [];

                for(const guildId of this.manager.options.guildIds) {

                    const clientGuild = await this.client.guilds.resolve(guildId);

                    if(!clientGuild) throw new Error(Errors.UNRESOLVABLE_GUILD)

                    this.guilds.push(clientGuild);

                }

                if(userInteraction.isDevGuildOnly) {

                    for(const guild of guilds) {

                        const guildCommand = await guild.commands.create({ name: userInteraction.name, type: "USER", defaultPermission: userInteraction.defaultEnabled })

                        userInteraction.setID(guildCommand.id);

                    }

                } else {

                    const applicationCommand = await this.client.application.commands.create({ name: userInteraction.name, type: "USER", defaultPermission: userInteraction.defaultEnabled })

                    userInteraction.setID(applicationCommand.id);

                }

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Deploys all user interactions
     * @returns {Promise<Boolean|Error>}
     */
    deployAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this._userInteractions.forEach((SC) => { this.deploy(SC) });

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Gets a user interaction
     * @param {String} name The name of the user interaction
     * @returns {?UserInteraction}
     */
    get(name) {

        const clientUserInteraction = this._userInteractions.get(name);

        return clientUserInteraction ?? null;

    }

    /**
     * Checks if there is any user interaction with a specific name
     * @param {String} name The name of the user interaction
     * @returns {Boolean}
     */
    has(name) {

        return this._userInteractions.has(name);

    }

    /**
     * Lists all user interactions
     * @returns {UserInteraction[]}
     */
    list() {

        return this._userInteractions.toJSON();

    }

    /**
     * Load a specific user interaction
     * @param {String} path The path of the user interaction
     * @returns {Promise<Boolean|Error>}
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /**
                 * @type {UserInteraction}
                 */
                const userInteractionFile = new(require(path))(this.client);

                userInteractionFile.setLocation(path);

                if(userInteractionFile?.init && typeof userInteractionFile?.init === 'function') userInteractionFile.init();

                this._userInteractions.set(userInteractionFile.name, userInteractionFile);
                this.manager._interactions.set(userInteractionFile.name, userInteractionFile);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Loads all user interactions
     * @return {Promise<Boolean|Error>}
     */
    loadAll() {

         return new Promise(async (resolve, reject) => {

             try {

                 const userInteractionDir = await this.manager.readDirectory(this.manager.options.locationUsers);

                 try {

                     for(const userInteractionCategoryDir of userInteractionDir) {

                         const userInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationUsers}/${userInteractionCategoryDir}`);

                         for(const userInteractionFile of userInteractionFiles) {

                             await this.load(`${this.manager.options.locationUsers}/${userInteractionCategoryDir}/${userInteractionFile}`);

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
     * Reloads a specific user interactions
     * @param {String} name The name of the user interaction
     * @return {Promise<Boolean|Error>}
     */
    reload(name) {

        const clientUserInteraction = this._userInteractions.get(name);

        if(!clientUserInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                await this.unload(name);

                resolve(await this.load(clientUserInteraction?.location))

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads all user interactions
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
     * Gets the size of all user interactions
     * @returns {Number}
     */
    size() {

        return this._userInteractions.size;

    }

    /**
     * Unloads a specific user interactions
     * @param {String} name The name of the user interaction
     * @return {Promise<Boolean|Error>}
     */
    unload(name) {

        const clientUserInteraction = this._userInteractions.get(name);

        if(!clientUserInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                delete require.cache[require.resolve(clientUserInteraction?.location)];

                this._userInteractions.delete(name);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Unload all user interactions
     * @return {Promise<Boolean|Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const userInteractionDir = await this.manager.readDirectory(this.manager.options.locationUsers);

                try {

                    for(const userInteractionCategoryDir of userInteractionDir) {

                        const userInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationUsers}/${userInteractionCategoryDir}`);

                        for(const userInteractionFile of userInteractionFiles) {

                            if(!this._userInteractions.has(userInteractionFile)) return;

                            await this.unload(userInteractionFile);

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

module.exports = UserInteractionManager;
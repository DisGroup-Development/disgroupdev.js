const Base = require('../structures/Base');
const Errors = require('../utils/Errors');
const Discord = require('discord.js');
const MessageInteraction = require('../structures/MessageInteraction');

/**
 * The message interaction manager for handling message interactions
 * @extends {Base}
 */
class MessageInteractionManager extends Base {

    constructor(client, interactionManager) {

        super(client);

        /**
         * The interaction manager
         * @type {InteractionManager}
         * @public
         */
        this.manager = interactionManager;

        /**
         * A collection of all message interactions
         * @type {Discord.Collection<String, MessageInteraction>}
         * @private
         */
        this._messageInteractions = new Discord.Collection();

    }

    /**
     * Deploys a specific message interaction
     * @param {MessageInteraction} messageInteraction
     * @returns {Promise<Boolean|Error>}
     */
    deploy(messageInteraction) {

        if(!messageInteraction instanceof MessageInteraction) throw new Error(Errors.COMMAND_NOT_A_SLASH_COMMAND_OBJECT);

        return new Promise(async (resolve, reject) => {

            try {

                if(!messageInteraction.deployEnabled) reject(Errors.COMMAND_NOT_ENABLED_FOR_DEPLOYING);

                /**
                 * @type {Array<Discord.Guild>|[]}
                 */
                const guilds = [];

                for(const guildId of this.manager.options.guildIds) {

                    const clientGuild = await this.client.guilds.resolve(guildId);

                    if(!clientGuild) throw new Error(Errors.UNRESOLVABLE_GUILD)

                    this.guilds.push(clientGuild);

                }

                if(messageInteraction.isDevGuildOnly) {

                    for(const guild of guilds) {

                        const guildCommand = await guild.commands.create({ name: messageInteraction.name, type: "MESSAGE", defaultPermission: messageInteraction.defaultEnabled })

                        messageInteraction.setID(guildCommand.id);

                    }

                } else {

                    const applicationCommand = await this.client.application.commands.create({ name: messageInteraction.name, type: "MESSAGE", defaultPermission: messageInteraction.defaultEnabled })

                    messageInteraction.setID(applicationCommand.id);

                }

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Deploys all message interactions
     * @returns {Promise<Boolean|Error>}
     */
    deployAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this._messageInteractions.forEach((SC) => { this.deploy(SC) });

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Gets a message interaction
     * @param {String} name The name of the message interaction
     * @returns {?UserInteraction|null}
     */
    get(name) {

        const clientMessageInteraction = this._messageInteractions.get(name);

        return clientMessageInteraction ?? null;

    }

    /**
     * Checks if there is any message interaction with a specific name
     * @param {String} name The name of the message interaction
     * @returns {Boolean}
     */
    has(name) {

        return this._messageInteractions.has(name);

    }

    /**
     * Lists all message interactions
     * @returns {MessageInteraction[]}
     */
    list() {

        return this._messageInteractions.toJSON();

    }

    /**
     * Load a specific message interaction
     * @param {String} name The name of the message interaction
     * @param {String} path The path of the message interaction
     * @returns {Promise<Boolean|Error>}
     */
    load(name, path) {

        return new Promise(async (resolve, reject) => {

            try {

                /**
                 * @type {MessageInteraction}
                 */
                const messageInteractionFile = new(require(path))(this.client);

                messageInteractionFile.setLocation(path);

                if(messageInteractionFile?.init && typeof messageInteractionFile?.init === 'function') messageInteractionFile.init();

                this._messageInteractions.set(messageInteractionFile.name, messageInteractionFile);
                this.manager._interactions.set(messageInteractionFile.name, messageInteractionFile);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Loads all message interactions
     * @return {Promise<Boolean|Error>}
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const messageInteractionDir = await this.manager.readDirectory(this.manager.options.locationmessages);

                try {

                    for(const messageInteractionCategoryDir of messageInteractionDir) {

                        const messageInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationmessages}/${messageInteractionCategoryDir}`);

                        for(const messageInteractionFile of messageInteractionFiles) {

                            this.load(messageInteractionFile, `${this.manager.options.locationmessages}/${messageInteractionFile}`);

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
     * Reloads a specific message interactions
     * @param {String} name The name of the message interaction
     * @return {Promise<Boolean|Error>}
     */
    reload(name) {

        const clientMessageInteraction = this._messageInteractions.get(name);

        if(!clientMessageInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                await this.unload(name);

                resolve(await this.load(name, clientMessageInteraction?.location))

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads all message interactions
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
     * Gets the size of all message interactions
     * @returns {Number}
     */
    size() {

        return this._messageInteractions.size;

    }

    /**
     * Unloads a specific message interactions
     * @param {String} name The name of the message interaction
     * @return {Promise<Boolean|Error>}
     */
    unload(name) {

        const clientMessageInteraction = this._messageInteractions.get(name);

        if(!clientMessageInteraction) throw new Error(Errors.INTERACTION_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                delete require.cache[require.resolve(clientMessageInteraction?.location)];

                this._messageInteractions.delete(name);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Unload all message interactions
     * @return {Promise<Boolean|Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const messageInteractionDir = await this.manager.readDirectory(this.manager.options.locationmessages);

                try {

                    for(const messageInteractionCategoryDir of messageInteractionDir) {

                        const messageInteractionFiles = await this.manager.readDirectory(`${this.manager.options.locationmessages}/${messageInteractionCategoryDir}`);

                        for(const messageInteractionFile of messageInteractionFiles) {

                            if(!this._messageInteractions.has(messageInteractionFile)) return;

                            this.unload(messageInteractionFile);

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

module.exports = MessageInteractionManager;
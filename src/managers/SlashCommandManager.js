const Base = require('../structures/Base');
const Discord = require('discord.js');
const Errors = require('../utils/Errors');
const SlashCommand = require('../structures/SlashCommand');

/**
 * The slash command manager for handling slash command interactions
 * @extends {Base}
 */
class SlashCommandManager extends Base {

    /**
     * The constructor for the SlashCommandManager
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
         * A collection of all slash commands
         * @type {Discord.Collection<String, SlashCommand>}
         * @private
         */
        this._slashCommands = new Discord.Collection();

    }

    /**
     * Deploys a specific slash command
     * @param {SlashCommand} slashCommand
     * @returns {Promise<Boolean|Error>}
     */
    deploy(slashCommand) {

        if(!slashCommand instanceof SlashCommand) throw new Error(Errors.COMMAND_NOT_A_SLASH_COMMAND_OBJECT);

        return new Promise(async (resolve, reject) => {

            try {

                if(!slashCommand.deployEnabled) reject(Errors.COMMAND_NOT_ENABLED_FOR_DEPLOYING);

                /**
                 * @type {Array<Discord.Guild>|[]}
                 */
                const guilds = [];

                for(const guildId of this.manager.options.guildIds) {

                    const clientGuild = await this.client.guilds.resolve(guildId);

                    if(!clientGuild) throw new Error(Errors.UNRESOLVABLE_GUILD)

                    this.guilds.push(clientGuild);

                }

                if(slashCommand.isDevGuildOnly) {

                    for(const guild of guilds) {

                        const guildCommand = await guild.commands.create({ name: slashCommand.name, description: slashCommand.description, options: slashCommand.options, type: "CHAT_INPUT", defaultPermission: slashCommand.defaultEnabled })

                        slashCommand.setID(guildCommand.id);

                    }

                } else {

                    const applicationCommand = await this.client.application.commands.create({ name: slashCommand.name, description: slashCommand.description, options: slashCommand.options, type: "CHAT_INPUT", defaultPermission: slashCommand.defaultEnabled })

                    slashCommand.setID(applicationCommand.id);

                }

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Deploys all slash commands
     * @returns {Promise<Boolean|Error>}
     */
    deployAll() {

        return new Promise(async (resolve, reject) => {

            try {

                await this._slashCommands.forEach((SC) => { this.deploy(SC) });

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Gets a slash command
     * @param {String} name The name of the slash command
     * @returns {?SlashCommand}
     */
    get(name) {

        const clientCommand = this._slashCommands.get(name);

        return clientCommand ?? null;

    }

    /**
     * Checks if there is any slash command with a specific name
     * @param {String} name The name of the slash command
     * @returns {Boolean}
     */
    has(name) {

        return this._slashCommands.has(name);

    }

    /**
     * Lists all slash commands
     * @returns {SlashCommand[]}
     */
    list() {

        return this._slashCommands.toJSON();

    }

    /**
     * Load a specific slash command
     * @param {String} path The path of the slash command
     * @returns {Promise<Boolean|Error>}
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /**
                 * @type {SlashCommand}
                 */
                const slashCommandFile = new(require(path))(this.client);

                slashCommandFile.setLocation(path);

                if(slashCommandFile?.init && typeof slashCommandFile?.init === 'function') slashCommandFile.init();

                this._slashCommands.set(slashCommandFile.name, slashCommandFile);
                this.manager._interactions.set(slashCommandFile.name, slashCommandFile);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Loads all slash commands
     * @return {Promise<Boolean|Error>}
     */
     loadAll() {

         return new Promise(async (resolve, reject) => {

             try {

                 const slashCommandDir = await this.manager.readDirectory(this.manager.options.locationSlashs);

                 try {

                     for(const slashCommandCategoryDir of slashCommandDir) {

                         const slashCommandFiles = await this.manager.readDirectory(`${this.manager.options.locationSlashs}/${slashCommandCategoryDir}`);

                         for(const slashCommandFile of slashCommandFiles) {

                             await this.load(`${this.manager.options.locationSlashs}/${slashCommandCategoryDir}/${slashCommandFile}`);

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
     * Reloads a specific slash commands
     * @param {String} name The name of the slash command
     * @return {Promise<Boolean|Error>}
     */
    reload(name) {

        const clientCommand = this._slashCommands.get(name);

        if(!clientCommand) throw new Error(Errors.COMMAND_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                await this.unload(name);

                resolve(await this.load(clientCommand?.location))

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Reloads all slash commands
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
     * Gets the size of all slash commands
     * @returns {Number}
     */
    size() {

        return this._slashCommands.size;

    }

    /**
     * Unloads a specific slash commands
     * @param {String} name The name of the slash command
     * @return {Promise<Boolean|Error>}
     */
    unload(name) {

        const clientCommand = this._slashCommands.get(name);

        if(!clientCommand) throw new Error(Errors.COMMAND_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                delete require.cache[require.resolve(clientCommand?.location)];

                this._slashCommands.delete(name);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Unload all slash commands
     * @return {Promise<Boolean|Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const slashCommandDir = await this.manager.readDirectory(this.manager.options.locationSlashs);

                try {

                    for(const slashCommandCategoryDir of slashCommandDir) {

                        const slashCommandFiles = await this.manager.readDirectory(`${this.manager.options.locationSlashs}/${slashCommandCategoryDir}`);

                        for(const slashCommandFile of slashCommandFiles) {

                            if(!this._slashCommands.has(slashCommandFile)) return;

                            await this.unload(slashCommandFile);

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

module.exports = SlashCommandManager;
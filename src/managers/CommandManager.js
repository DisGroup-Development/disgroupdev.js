const Base = require('../structures/Base');
const Discord = require('discord.js');
const Errors = require('../utils/Errors');
const FileSystem = require('node:fs');
const Util = require('node:util');

/**
 * The options
 * @typedef {Object} CommandManagerOptions
 * @property {String} locationCommands The location of the commands
 */

/**
 * The command manager for handling command interactions
 * @extends {Base}
 */
class CommandManager extends Base {

    /**
     * The constructor for the EventManager
     * @param {Discord.Client} client
     * @param {CommandManagerOptions} options
     */
    constructor(client, options = {}) {

        super(client);

        if(!options?.locationCommands || typeof options?.locationCommands !== 'string') throw new Error(Errors.INVALID_SOURCE);

        /**
         * A collection of all commands
         * @type {Discord.Collection<String, Command>}
         * @private
         */
        this._commands = new Discord.Collection();

        /**
         * Reads a directory
         * @private
         */
        this.readDirectory = Util.promisify(FileSystem.readdir);

        /**
         * The options of the EventManager
         * @type {CommandManagerOptions}
         * @public
         */
        this.options = options;

    }

    /**
     * Gets a command
     * @param {String} name The name of the command
     * @returns {?Command}
     */
    get(name) {

        const clientCommand = this._commands.get(name);

        return clientCommand ?? null;

    }

    /**
     * Checks if there is any command with a specific name
     * @param {String} name The name of the command
     * @returns {Boolean}
     */
    has(name) {

        return this._commands.has(name);

    }

    /**
     * Lists all commands
     * @returns {Command[]}
     */
    list() {

        return this._commands.toJSON();

    }

    /**
     * Load a specific command
     * @param {String} path The path of the command
     * @returns {Promise<Boolean|Error>}
     */
    load(path) {

        const clientCommand = this._commands.some((cmd) => cmd.location === path);

        if(clientCommand) throw new Error(Errors.COMMAND_ALREADY_LOADED);

        return new Promise(async (resolve, reject) => {

            try {

                /**
                 * @type {Command}
                 */
                const commandFile = new(require(path))(this.client, this);

                commandFile.setLocation(path);

                if(commandFile?.init && typeof commandFile?.init === 'function') commandFile.init();

                this._commands.set(commandFile.name, commandFile);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Loads all commands
     * @return {Promise<Boolean|Error>}
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const commandDir = await this.readDirectory(this.options.locationCommands);

                try {

                    for(const commandCategoryDir of commandDir) {

                        const commandFiles = await this.readDirectory(`${this.options.locationCommands}/${commandCategoryDir}`);

                        for(const commandFile of commandFiles) {

                            await this.load(`${this.options.locationCommands}/${commandCategoryDir}/${commandFile}`);

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
     * Reloads a specific commands
     * @param {String} name The name of the command
     * @return {Promise<Boolean|Error>}
     */
    reload(name) {

        const clientCommand = this._commands.get(name);

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
     * Reloads all commands
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
     * Gets the size of all commands
     * @returns {Number}
     */
    size() {

        return this._commands.size;

    }

    /**
     * Unloads a specific commands
     * @param {String} name The name of the command
     * @return {Promise<Boolean|Error>}
     */
    unload(name) {

        const clientCommand = this._commands.get(name);

        if(!clientCommand) throw new Error(Errors.COMMAND_NOT_EXISTS);

        return new Promise(async (resolve, reject) => {

            try {

                delete require.cache[require.resolve(clientCommand?.location)];

                this._commands.delete(name);

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    /**
     * Unload all commands
     * @return {Promise<Boolean|Error>}
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const commandDir = await this.manager.readDirectory(this.options.locationCommands);

                try {

                    for(const commandCategoryDir of commandDir) {

                        const commandFiles = await this.manager.readDirectory(`${this.options.locationCommands}/${commandCategoryDir}`);

                        for(const commandFile of commandFiles) {

                            if(!this._commands.has(commandFile)) return;

                            await this.unload(commandFile);

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

module.exports = CommandManager;
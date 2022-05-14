const { Client, Collection, Guild } = require('discord.js');
const SlashCommand = require('../../structures/interaction/SlashCommand');

const { DisGroupDevError, Messages } = require('../../errors/DisGroupDevError');

const readDirectory = require('node:util').promisify(require('node:fs').readdir);
const statDirectory = require('node:util').promisify(require('node:fs').stat);

/**
 * The slash command interaction manager.
 * @class
 */
class SlashCommandInteractionManager {

    /**
     * The constructor of the slash command interaction manager class.
     * @param {Client} client
     * @param {InteractionManager} interactionManager
     */
    constructor(client, interactionManager) {

        /**
         * The cache with all slash commands
         * @type {Collection<String, SlashCommand>}
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
     * Deploys one specific slash command
     * @param {SlashCommand} slashCommand
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    deploy(slashCommand) {

        return new Promise(async (resolve, reject) => {

            if(!slashCommand instanceof SlashCommand) reject(new DisGroupDevError(Messages.NOT_INSTANCE_OF(slashCommand, SlashCommand)));
            if(!slashCommand.deployEnabled) reject(new DisGroupDevError(Messages.NOT_ENABLED));

            try {

                /** @type {Guild[]} */
                let guilds = [];

                for(const guildId of this.manager.options.guildIDs) {

                    const guild = this.client.guilds.resolve(guildId);

                    if(!guild || !guild instanceof Guild) reject(new DisGroupDevError(Messages.UNRESOLVABLE_GUILD(guildId)));

                    guilds.push(guild);

                }

                if(slashCommand.guildOnly) {

                    for(const guild of guilds) {

                        const guildCommand = await guild.commands.create({ name: slashCommand.name, description: slashCommand.description, type: "CHAT_INPUT", options: slashCommand.options, defaultPermission: slashCommand.defaultEnabled });

                        slashCommand.id = guildCommand.id;

                    }

                } else {

                    const applicationCommand = await this.client.application.commands.create({ name: slashCommand.name, description: slashCommand.description, type: "CHAT_INPUT", options: slashCommand.options, defaultPermission: slashCommand.defaultEnabled });

                    slashCommand.id = applicationCommand.id;

                }

            } catch(e) {

                reject(new DisGroupDevError(e));

            }


        });

    }


    /**
     * Deploys all slash commands
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    deployAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const slashCommand of this.cache) {

                    await this.deploy(slashCommand);

                }

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads one specific slash command
     * @param {String} path
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    load(path) {

        return new Promise(async (resolve, reject) => {

            try {

                /** @type {SlashCommand} */
                const slashCommand = new(require(path))(this.client, this.manager);

                slashCommand.location = path;

                if(slashCommand.init && typeof slashCommand.init === 'function') slashCommand.init();
                if(!slashCommand.execute || typeof slashCommand.execute !== 'function') reject(new DisGroupDevError(Messages.INVALID_EXECUTE(slashCommand.name)));

                this.cache.set(slashCommand.name, slashCommand);

                resolve(true);


            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads all slash commands
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    loadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                const slashCommandDirectory = await readDirectory(this.manager.options.locationSlashCommands);

                for(const slashCommandDirectoryCategoryOrFile of slashCommandDirectory) {

                    const slashCommandDirectoryStat = await statDirectory(require('node:path').resolve(this.manager.options.locationSlashCommands, slashCommandDirectoryCategoryOrFile));

                    if(slashCommandDirectoryStat.isDirectory()) {

                        const slashCommandDirectoryCategory = await readDirectory(require('node:paht').resolve(this.manager.options.locationSlashCommands, slashCommandDirectoryCategoryOrFile));

                        for(const slashCommandDirectoryCategoryFile of slashCommandDirectoryCategory) {

                            await this.load(`${this.manager.options.locationSlashCommands}/${slashCommandDirectoryCategoryOrFile}/${slashCommandDirectoryCategoryFile}`);

                        }

                    } else if(slashCommandDirectoryStat.isFile()) {

                        await this.load(`${this.manager.options.locationSlashCommands}/${slashCommandDirectoryCategoryOrFile}`);

                    }

                }

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads one specific slash command
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) reject(new DisGroupDevError(Messages.COMMAND_NOT_FOUND(name)));

            const { location } = require(this.cache.get(name));

            try {

                await this.unload(name);
                await this.load(location);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Reloads all specific slash commands
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    reloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const slashCommand of this.cache) {

                    await this.unload(slashCommand.name);

                }

                await this.loadAll();

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads one specific slash command
     * @param {String} name
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unload(name) {

        return new Promise(async (resolve, reject) => {

            if(!this.cache.has(name)) reject(new DisGroupDevError(Messages.COMMAND_NOT_FOUND(name)));

            try {

                delete require.cache[require.resolve(this.cache.get(name).location)];

                this.cache.delete(name);

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Unloads all slash commands
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    unloadAll() {

        return new Promise(async (resolve, reject) => {

            try {

                for(const slashCommand of this.cache) {

                    await this.unload(slashCommand.name);

                }

                resolve(true);

            } catch (e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

}

module.exports = SlashCommandInteractionManager;
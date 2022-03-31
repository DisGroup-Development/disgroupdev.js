const BackUp = require('../structures/BackUp');
const Base = require('../structures/Base');
const Discord = require('discord.js');

/**
 * @typedef {Object} BackUpManagerOptions
 * @property {String} backupLocations The location of the backups
 */

/**
 * The backup manager for creating and managing guild backups
 */
class BackUpManager extends Base {

    /**
     * The constructor for the backup manager
     * @param {import('discord.js').Client} client The client
     * @param {BackUpManagerOptions} options The options for the backup manager
     */
    constructor(client, options) {

        /**
         * The client
         * @type {import('discord.js').Client}
         */
        this.client = client;

        /**
         * The options for the backup manager
         * @type {BackUpManagerOptions}
         */
        this.options = options;

        /**
         * @private
         */
        this._readDirectory = require('node:fs/promises').readdir;

    }

    /**
     * @param {import('discord.js').Guild} guild
     * @private
     */
    async _getGuildBans(guild) {

        const guildBans = [];

        (await guild?.bans?.fetch()).forEach((guildBan) => {

            guildBans.push({ id: guildBan?.user?.id, reason: guildBan?.reason ?? ' ' });

        });

        return guildBans;

    }

    /**
     * @param {import('discord.js').Guild} guild
     * @param {Number} messagesPerChannel
     * @private
     */
    async _getGuildChannels(guild, messagesPerChannel) {

        /**
         * @param {import('discord.js').GuildChannel} channel
         */
        function fetchChannelPermissions(channel) {

            const channelPermissions = [];

            channel.permissionOverwrites.cache.forEach // In Development @XEfnexX

            return channelPermissions;

        }

        const guildChannelsData = { categories: [], others: [] };

        (await guild?.channels?.fetch()).sort((a, b) => b.position - a.position).forEach((guildChannels) => {

            if(guildChannels.type === 'GUILD_CATEGORY') {

                for(const guildChannelCategorie of guildChannels) {

                    const guildChannelsCategorieData = {

                        children: [],
                        name: guildChannelCategorie?.name,
                        permissions: fetchChannelPermissions(guildChannelCategorie)

                    }

                    guildChannelsData.categories.push(guildChannelsCategorieData);

                }

            }

        });

        return guildChannels;

    }

    /**
     * @param {import('discord.js').Guild} guild
     * @private
     */
    async _getGuildEmojis(guild) {

        const guildEmojis = [];

        (await guild?.emojis?.fetch()).forEach((guildEmoji) => {

            guildEmojis.push({ name: guildEmoji?.name, url: guildEmoji?.url });

        });

        return guildEmojis;

    }

    /**
     * @param {import('discord.js').Guild} guild
     * @private
     */
    async _getGuildRoles(guild) {

        const guildRoles = [];

        (await guild?.roles?.fetch()).sort((a, b) => b.position - a.position).forEach((guildRole) => {

            if(guildRole.managed) return;

            guildRoles.push({ color: guildRole?.hexColor, hoist: guildRole?.hoist, isEveryone: guild.id === guildRole.id, mentionable: guildRole?.mentionable, name: guildRole?.name, permissions: guildRole?.permissions?.bitfield, position: guildRole?.position });

        });

        return guildRoles;

    }

    /**
     * @param {import('discord.js').Guild} guild
     * @private
     */
    async _getGuildStickers(guild) {

        const guildStickers = [];

        (await guild?.stickers?.fetch()).forEach((guildSticker) => {

            guildStickers.push({ description: guildSticker?.description, name: guildSticker?.name, tags: guildSticker?.tags, url: guildSticker?.url });

        });

        return guildStickers;

    }

    /**
     * @typedef {Object} BackUpCreateOptions
     * @property {?String} backupId The id of the backup (Only set if you want to overwride a existing backup)
     * @property {?Array<String>} doNotBackup The things the backup should not include ("bans", "channels", "emojis", "roles" and "stickers")
     * @property {?Number} messagesPerChannel The amount of messages that should be saved (Default: 10)
     */

    /**
     * Creates a backup
     * @param {import('discord.js').Guild} guild 
     * @param {import('discord.js').User} user
     * @param {BackUpCreateOptions} options
     * @returns {Promise<BackUp|Error} 
     */
    create(guild, user, options = { backupId: null, doNotBackup: [], messagesPerChannel: 10 }) {

        return new Promise(async (resolve, reject) => {

            try {

                const backup = new BackUp(this.client, this, {

                    afk: { enabled: ( guild.afkChannelId ? true : false ), id: guild?.afkChannelId ?? ' ', name: guild.channels.resolve(guild?.afkChannelId)?.name ?? ' ', timeout: guild?.afkTimeout ?? 0 },
                    bannerURL: guild?.bannerURL() ?? ' ',
                    bans: options.doNotBackup.includes('bans') ? [] : await this._getGuildBans(guild),
                    channels: options.doNotBackup.includes('channels') ? [] : await this._getGuildChannels(guild, options.messagesPerChannel),
                    createdTimestamp: Date.now(),
                    creatorId: user?.id ?? ' ',
                    defaultMessageNotificationLevel: guild?.defaultMessageNotificationLevel ?? 'ONLY_MENTIONS',
                    description: guild?.description ?? ' ',
                    discoverySplashURL: guild?.discoverySplashURL() ?? ' ',
                    emojis: options.doNotBackup.includes('emojis') ? [] : await this._getGuildEmojis(guild),
                    explicitContentFilterLevel: guild?.explicitContentFilter ?? 'ALL_MEMBERS',
                    guildId: guild?.id ?? ' ',
                    iconURL: guild?.iconURL() ?? ' ',
                    id: Discord.SnowflakeUtil.generate(Date.now()),
                    isCommunity: ( guild?.features?.includes('COMMUNITY') ? true : false ),
                    locale: guild?.preferredLocale ?? 'en-US',
                    name: guild?.name,
                    nsfwLevel: guild?.nsfwLevel ?? 'SAFE',
                    progressBar: guild?.premiumProgressBarEnabled ?? false,
                    roles: options.doNotBackup.includes('roles') ? [] : await this._getGuildRoles(guild),
                    rulesChannel: { id: guild?.rulesChannelId ?? ' ', name: guild.channels.resolve(guild?.rulesChannelId)?.name ?? ' ' },
                    splashURL: guild?.splashURL() ?? ' ',
                    stickers: options.doNotBackup.includes('stickers') ? [] : await this._getGuildStickers(guild),
                    systemChannel: { enabled: ( guild?.systemChannelId ? true : false ), flags: guild?.systemChannelFlags ?? [], id: guild?.systemChannelId ?? ' ', name: guild.channels.resolve(guild?.systemChannelId)?.name ?? ' ' },
                    updateChannel: { id: guild?.publicUpdatesChannelId ?? ' ', name: guild.channels.resolve(guild?.publicUpdatesChannelId)?.name ?? ' ' },
                    verificationLevel: guild?.verificationLevel ?? 'LOW',
                    widget: { enabled: guild?.widgetEnabled ?? false, id: guild?.widgetChannelId, name: guild.channels.resolve(guild?.widgetChannelId)?.name ?? ' ' }

                });

                await require('node:fs').writeFile(`${this.options.backupLocations}${require('path').sep}${backup.id}`, JSON.stringify(backup.data, null, 4), 'utf-8');

                resolve(backup);

            } catch (err) {

                reject(err);

            }

        });

    }

    /**
     * Deletes a backup
     * @param {String} backupId The id of the backupp
     * @returns {Promise<Boolean>}
     */
    delete(backupId) {

        return new Promise(async (resolve, reject) => {

            try {

                require(`${this.options.backupLocations}${require('path').sep}${backupId}.json`)
                require('node:fs').unlinkSync(`${this.options.backupLocations}${require('path').sep}${backupId}.json`);
                resolve(true);
    
            } catch (err) {

                reject(false);

            }

        });

    }

    /**
     * @typedef {Object} BackUpFetchData
     * @property {BackUp} data The data of the backup
     * @property {String} id The id of the backup
     * @property {String} size The size of the backup
     */

    /**
     * Fetches a backup
     * @param {String} backupId The id of the backup
     * @returns {Promise<BackUpFetchData|null>}
     */
    fetch(backupId) {

        return new Promise(async (resolve, reject) => {

            this.getBackUp(backupId)
                .then((backUp) => {

                    const backupSize = require('node:fs').statSync(`${this.options.backupLocations}${require('path').sep}${backupId}.json`).size;

                    resolve({ data: backUp, id: backupId, size: backupSize });

                })
                .catch(() => reject(null));

        });

    }

    /**
     * Gets a backup
     * @param {String} backupId The id of the backup
     * @returns {Promise<BackUp|null>}
     */
    getBackUp(backupId) {

        return new Promise(async (resolve, reject) => {

            const backupFiles = await this._readDirectory(this.options.backupLocations);
            const backupFile = backupFiles.filter((file) => file.split('.').pop() === 'json').find((file) => file === `${backupId}.json`);

            if(!backupFile) reject(null);

            const backupFileData = require(`${this.options.backupLocations}${require('path').sep}${backupFile}`);

            resolve(new BackUp(this.client, this, backupFileData));

        });

    }

    /**
     * Lists all backups
     * @returns {Map<String>}
     */
    async list() {

        const backupFiles = await this._readDirectory(this.options.backupLocations);

        return backupFiles.map((backupFile) => backupFile.split('.')[0]);

    }

}

module.exports = BackUpManager;
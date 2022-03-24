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
     * @typedef {Object} BackUpCreateOptions
     * @property {?String} backupId The id of the backup (Only set if you want to overwride a existing backup)
     * @property {?Array<String>} doNotBackup The things the backup should not include ("bans", "channels", "emojis" and "roles")
     * @property {?Number} messagesPerChannel The amount of messages that should be saved (Default: 10)
     */

    /**
     * Creates a backup
     * @param {import('discord.js').Guild} guild 
     * @param {BackUpCreateOptions} options
     * @returns {BackUp} 
     */
    create(guild, options = { backupId: null, doNotBackup: [], messagesPerChannel: 10 }) {

        return new Promise(async (resolve, reject) => {



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
    list() {

        const backupFiles = await this._readDirectory(this.options.backupLocations);

        return backupFiles.map((backupFile) => backupFile.split('.')[0]);

    }

}

module.exports = BackUpManager;
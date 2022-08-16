const { WebhookClient } = require('discord.js');
const Chalk = require('chalk');
const Utils = require('./Utilities');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * @typedef {Object} LoggerIcons
 * @property {String} debug (Default: "⚒")
 * @property {String} error (Default: "🛑")
 * @property {String} fail (Default: "❌")
 * @property {String} info (Default: "ℹ")
 * @property {String} success (Default: "✅")
 * @property {String} warn (Default: "⚠")
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {?LoggerIcons} icons The icons which the logger uses
 * @property {String} name The name of the logger
 * @property {WebhookClient[]} webhooks An array of webhook clients, the messages should be sent to
 */

/**
 * The logger class
 * @class
 */
class Logger {

    /**
     * The constructor for the Logger
     * @param {LoggerOptions} options
     */
    constructor(options) {

        if(!options?.name || typeof options?.name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(undefined));

        if(!options?.icons) options.icons = { debug: "⚒", error: "🛑", fail: "❌", info: "ℹ", success: "✅", warn: "⚠" };
        if(!options?.webhooks) options.webhooks = [];

        /**
         * The options for the logger
         * @type {LoggerOptions}
         */
        this.options = options;

    }

    /**
     * @typedef {Object} LogData
     * @property {String} consoleString The string that should be logged to the console
     * @property {String} webhookString The string that should be logged to a webhook
     */

    /**
     * Logs a string
     * @param {LogData} strings The strings that should be logged
     * @private
     */
    _log(strings) {

        try {

            console.log(strings?.consoleString);

            for(const webhook of this.options?.webhooks) {

                if(!webhook instanceof WebhookClient) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(webhook, WebhookClient));

                webhook.send({ content: `\`\`\`JS\n${strings?.webhookString}\`\`\`` });

            }

        } catch(e) {

            throw new DisGroupDevError(e);

        }

    }

    /**
     * Debug
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    debug(string) {

        this._log({ consoleString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${Chalk.bgGreenBright.white(`${this.options.icons.debug} DEBUG`)} | ${string}`, webhookString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${this.options.icons.debug} DEBUG | ${string}`});

        return this;

    }

    /**
     * Error
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    error(string) {

        this._log({ consoleString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${Chalk.bgRedBright.white(`${this.options.icons.error} ERROR`)} | ${string}`, webhookString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${this.options.icons.error} ERROR | ${string}`});

        return this;

    }

    /**
     * Fail
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    fail(string) {

        this._log({ consoleString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${Chalk.bgRedBright.white(`${this.options.icons.fail} FAIL`)} | ${string}`, webhookString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${this.options.icons.fail} FAIL | ${string}`});

        return this;

    }

    /**
     * Info
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    info(string) {

        this._log({ consoleString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${Chalk.bgBlueBright.white(`${this.options.icons.info} INFO`)} | ${string}`, webhookString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${this.options.icons.info} INFO | ${string}`});

        return this;

    }

    /**
     * Success
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    success(string) {

        this._log({ consoleString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${Chalk.bgGreenBright.white(`${this.options.icons.success} SUCCESS`)} | ${string}`, webhookString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${this.options.icons.success} SUCCESS | ${string}`});

        return this;

    }

    /**
     * Warn
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    warn(string) {

        this._log({ consoleString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${Chalk.bgYellowBright.white(`${this.options.icons.warn} WARN`)} | ${string}`, webhookString: `[ ${this.options.name} | ${Utils.getReadableTime()} ] : ${this.options.icons.warn} WARN | ${string}`});

        return this;

    }

}

module.exports = Logger;
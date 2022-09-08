'use strict';

const Sentry = require('@sentry/node');
const Chalk = require('chalk');
const { WebhookClient } = require('discord.js');
const Utilities = require('./Utilities');

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
 * @property {?NodeOptions} sentryOptions The options for the Sentry client
 * @property {WebhookClient[]} webhooks An array of webhook clients, the messages should be sent to
 */

/**
 * The logger class
 * @class
 */
class Logger {
    /**
     * The constructor for the Logger
     * @param {LoggerOptions} options The options of the logger
     */
    constructor(options) {
        if (!options?.name || typeof options?.name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(options.name));

        options.icons = {

            debug: options.icons?.debug ?? '⚒',
            error: options.icons?.error ?? '🛑',
            fail: options.icons?.fail ?? '❌',
            info: options.icons?.info ?? 'ℹ',
            success: options.icons?.success ?? '✅',
            warn: options.icons?.warn ?? '⚠',

        };

        /**
         * The options for the logger
         * @type {LoggerOptions}
         * @public
         */
        this.options = options;

        /**
         * The Sentry client
         * @type {Sentry|null}
         * @public
         */
        this.sentry = options.sentryOptions ? Sentry.init(options.sentryOptions) : null;

        /**
         * The array with all webhook clients
         * @type {Array<WebhookClient>}
         * @public
         */
        this.webhooks = options.webhooks;
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
            // eslint-disable-next-line no-console
            console.log(strings?.consoleString);

            for (const webhook of this.options.webhooks) {
                if (!(webhook instanceof WebhookClient)) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(webhook, WebhookClient));

                webhook.send({ content: `\`\`\`JS\n${strings?.webhookString}\`\`\`` });
            }
        } catch (e) {
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
        this._log({
            consoleString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${Chalk.bgGreenBright.white(`${this.options.icons.debug} DEBUG`)} | ${string}`,
            webhookString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${this.options.icons.debug} DEBUG | ${string}`,
        });

        return this;
    }

    /**
     * Error
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    error(string) {
        this._log({
            consoleString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${Chalk.bgRedBright.white(`${this.options.icons.error} ERROR`)} | ${string}`,
            webhookString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${this.options.icons.error} ERROR | ${string}`,
        });
        this.sentry?.captureException(string);

        return this;
    }

    /**
     * Fail
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    fail(string) {
        this._log({
            consoleString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${Chalk.bgRedBright.white(`${this.options.icons.fail} FAIL`)} | ${string}`,
            webhookString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${this.options.icons.fail} FAIL | ${string}`,
        });
        this.sentry?.captureException(string);

        return this;
    }

    /**
     * Info
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    info(string) {
        this._log({
            consoleString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${Chalk.bgBlueBright.white(`${this.options.icons.info} INFO`)} | ${string}`,
            webhookString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${this.options.icons.info} INFO | ${string}`,
        });

        return this;
    }

    /**
     * Success
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    success(string) {
        this._log({
            consoleString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${Chalk.bgGreenBright.white(`${this.options.icons.success} SUCCESS`)} | ${string}`,
            webhookString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${this.options.icons.success} SUCCESS | ${string}`,
        });

        return this;
    }

    /**
     * Warn
     * @param {String} string The string that should be logged
     * @returns {Logger}
     * @public
     */
    warn(string) {
        this._log({
            consoleString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${Chalk.bgYellowBright.white(`${this.options.icons.warn} WARN`)} | ${string}`,
            webhookString: `[ ${this.options.name} | ${Utilities.getReadableTime()} ] : ${this.options.icons.warn} WARN | ${string}`,
        });

        return this;
    }
}

module.exports = Logger;

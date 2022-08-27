const { Collection, Snowflake, Util, WebhookClient } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { DateTime } = require('luxon');
const EventEmitter = require('node:events');
const FileSystem = require('node:fs');
const Fetch = import('node-fetch');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

let loadedIncidents = false;

/**
 * @typedef {Object} IncidentData
 * @property {String} id The id of the incident
 * @property {String} lastUpdate The last update of the incident
 * @property {Snowflake} messageId The id of the message of the incident
 * @property {Boolean} resolved If the incident is resolved
 */

/**
 * @typedef {Object} IncidentDataRaw
 * @property {IncidentDataRawComponent[]} components The components of the incident
 * @property {String} created_at The creation date of the incident
 * @property {String} id The id of the incident
 * @property {String} impact The impact of the incident
 * @property {IncidentDataRawComponentUpdate[]} incident_updates The updates of the incident
 * @property {String} monitoring_at The monitoring date of the incident
 * @property {String} name The name of the incident
 * @property {String} page_id The id of the status page
 * @property {String} resolved_at The resolved date of the incident
 * @property {String} shortlink The link of the incident
 * @property {String} started_at The start date of the incident
 * @property {String} status The status of the incident
 * @property {String} updated_at The last update of the incident
 */

/**
 * @typedef {Object} IncidentDataRawComponent
 * @property {String} created_at The creation date of the component
 * @property {String} description The description of the component
 * @property {Boolean} group If the component is a group
 * @property {String|null} group_id The id of the group of the component
 * @property {String} id The id of the component
 * @property {String} name The name of the component
 * @property {Boolean} only_show_if_degraded If the component is only shown if degraded
 * @property {String} page_id The id of the status page
 * @property {Number} position The position of the component
 * @property {Boolean} showcase If the component is in the showcase
 * @property {String|null} start_date The start date of the component
 * @property {String} status The status of the component
 * @property {String} updated_at The last update of the component
 */

/**
 * @typedef {Object} IncidentDataRawComponentUpdate
 * @property {String} code The code of the component update
 * @property {String} name The name of the component update
 * @property {String} new_status The new status of the component update
 * @property {String} old_status The old status of the component update
 */

/**
 * @typedef {Object} IncidentDataRawUpdate
 * @property {IncidentDataRawComponentUpdate[]} affected_components The affected components of the update
 * @property {String} body The body of the update
 * @property {String} created_at The creation date of the update
 * @property {String|null} custom_tweet The custom tweet of the update
 * @property {Boolean} deliver_notifications If the update should be delivered to the users
 * @property {String} display_at The display date of the update
 * @property {String} id The id of the incident update
 * @property {String} incident_id The id of the incident
 * @property {String} status The status of the incident update
 * @property {String|null} tweet_id The id of the tweet of the update
 * @property {String} update_at The date of the incident update
 */

/**
 * @typedef {Object} StatusPageCheckerOptions
 * @property {Number} checkInterval The time in ms the checker should check (default: 60000)
 * @property {StatusPageCheckerOptionsColors} colors The colors of the embeds
 * @property {String} storage The json file to save the incidents to
 * @property {String} url The URL of the status page you want to monitore
 * @property {WebhookClient} webhook webhook client
 */

/**
 * @typedef {Object} StatusPageCheckerOptionsColors
 * @property {String} BLACK (default: #000000)
 * @property {String} GREEN (default: #51f34d)
 * @property {String} ORANGE (default: #fcb22d)
 * @property {String} RED (default: #fe6b61)
 * @property {String} YELLOW (default: #ffde22)
 */

/**
 * The status page checker.
 * Inspired by @almostSouji
 * @extends {EventEmitter}
 * @class
 */
class StatusPageChecker extends EventEmitter {

    /**
     * The constructor of the status page checker class.
     * @param {StatusPageCheckerOptions} options
     */
    constructor(options = { colors: { BLACK: '#000000', GREEN: '#51f34d', ORANGE: '#fcb22d', RED: '#fe6b61', YELLOW: '#ffde22' } }) {

        super();

        /**
         * The cache with all page incidents
         * @type {Collection<String, IncidentData>}
         * @public
         */
        this.incidents = new Collection();

        /**
         * The options of the status page checker.
         * @type {StatusPageCheckerOptions}
         * @public
         */
        this.options = options;

        if(!options?.storage || typeof options.storage !== 'string') throw new DisGroupDevError(Messages.INVALID_LOCATION);
        if(!options?.url || typeof options.url !== 'string') throw new DisGroupDevError(Messages.INVALID_URL);
        if(!options?.webhook || !options.webhook instanceof WebhookClient) throw new DisGroupDevError(Messages.NOT_INSTANCE_OF(options?.webhook, WebhookClient));

        /**
         * The webhook client.
         * @type {WebhookClient}
         * @public
         */
        this.webhook = options.webhook;

        this.check();

        setInterval(() => this.check(), this.options.checkInterval ?? 60_000);

    }

    /**
     * Fetches the status page
     * @returns {Promise<Fetch.Response>}
     * @private
     */
    async _fetch() {

        const data = await (await Fetch).default(`${this.options.url}/api/v2/incidents.json`).then((r => r.json()));

        return data;

    }

    /**
     * Generates an incident embed
     * @param {IncidentDataRaw} incident
     * @returns {Promise<EmbedBuilder>}
     * @private
     */
    _generateEmbed(incident) {

        return new Promise(async (resolve, reject) => {

            try {

                const embedColor =
                    incident.status === 'resolved' || incident.status === 'postmortem'
                        ? this.options.colors.GREEN : incident.impact === 'critical'
                            ? this.options.colors.RED : incident.impact === 'major'
                                ? this.options.colors.ORANGE : incident.impact === 'minor'
                                    ? this.options.colors.YELLOW : this.options.colors.BLACK;

                const affectedComponentsNames = incident.components.map((c) => c.name);

                const embed = new EmbedBuilder()
                    .setTitle(incident.name)
                    .setColor(Util.resolveColor(embedColor))
                    .setFooter({ text: `ID: ${incident.id}` })
                    .setTimestamp(new Date(incident.started_at))
                    .setURL(incident.shortlink)

                for(const incidentUpdate of incident.incident_updates.reverse()) {

                    const incidentUpdateDate = DateTime.fromISO(incidentUpdate.created_at);
                    const incidentUpdateDateTimeStamp = `<t:${Math.floor(incidentUpdateDate.toSeconds())}:R>`;

                    embed.addFields({
                        name: `${incidentUpdate.status.charAt(0).toUpperCase()}${incidentUpdate.status.slice(1)} (${incidentUpdateDateTimeStamp})`,
                        value: incidentUpdate.body
                    });

                }

                const embedDescriptionParts = [`・ Impact: ${incident.impact}`];

                if(affectedComponentsNames.length) embedDescriptionParts.push(`・ Affected components: ${affectedComponentsNames.join(', ')}`);

                embed.setDescription(embedDescriptionParts.join('\n'));

                resolve(embed);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads all incidents from the storage file
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @private
     */
    _loadIncidents() {

        return new Promise(async (resolve, reject) => {

            try {

                const rawData = await this._loadRawIncidents();

                await rawData.forEach(rawDataIncident => {

                    this.incidents.set(rawDataIncident.id, {
                        id: rawDataIncident.id,
                        lastUpdate: rawDataIncident.lastUpdate,
                        messageId: rawDataIncident.messageId,
                        resolved: rawDataIncident.resolved
                    });

                });

                loadedIncidents = true;

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e));

            }

        });

    }

    /**
     * Loads all incidents raw from the storage file
     * @returns {Promise<Array<IncidentData>>}
     * @private
     */
    _loadRawIncidents() {

        return new Promise(async (resolve, reject) => {

            const storage = await require('util').promisify(FileSystem.exists)(this.options.storage);

            if(!storage) {

                await require('util').promisify(FileSystem.writeFile)(this.options.storage, JSON.stringify(new Array()), 'utf-8');

                resolve([]);

            } else {

                const storageContent = await require('util').promisify(FileSystem.readFile)(this.options.storage);

                try {

                    const storageIncidents = await JSON.parse(storageContent.toString());

                    if(Array.isArray(storageIncidents)) {

                        resolve(storageIncidents)

                    } else {

                        resolve([]);

                    }

                } catch(e) {

                    resolve([]);

                }

            }

        });

    }

    /**
     * Saves the incidents to the file
     * @returns {Promise<Boolean>}
     * @private
     */
    async _save() {

        await require('util').promisify(FileSystem.writeFile)(this.options.storage, JSON.stringify(this.incidents, null, 4), 'utf-8');

        return true;

    }

    /**
     * The check function
     * @returns {Promise<Boolean|DisGroupDevError>}
     * @public
     */
    async check() {

        if(!loadedIncidents) {

            await this._loadIncidents();

            return this.check();

        }

        /**
         * Emitted when a check has started.
         * @event StatusPageChecker#incidentCheck
         */
        this.emit('incidentCheck');

        try {

            const fetched = await this._fetch();
            /** @type {IncidentDataRaw[]} */
            const fetchedIncidents = fetched.incidents;

            for(const incident of fetchedIncidents?.reverse()) {

                const incidentData = this.incidents.get(incident.id);

                if(!incidentData) {

                    /**
                     * Emitted when a new incident has been found
                     * @event StatusPageChecker#incidentCreate
                     * @param {IncidentData} incidentData
                     */
                    this.emit('incidentCreate', incidentData);

                    return this.updateIncident(incident);

                }

                const incidentUpdate = DateTime.fromISO(incident.updated_at ?? incident.created_at);

                if(DateTime.fromISO(incidentData.lastUpdate) < incidentUpdate) {

                    /**
                     * Emitted when an incident has been updated
                     * @event StatusPageChecker#incidentUpdate
                     * @param {IncidentData} incidentData
                     */
                    this.emit('incidentUpdate', incidentData);

                    return this.updateIncident(incident, incidentData.messageId);

                }

            }

        } catch(e) {

            throw new DisGroupDevError(e);

        }

    }

    /**
     * Updates an incident
     * @param {IncidentDataRaw} incident The raw data of the incident
     * @param {?String} messageId The id of the webhook message
     * @returns {Promise<Boolean|DisGroupDevError>}
     */
    updateIncident(incident, messageId = null) {

        return new Promise(async (resolve, reject) => {

            const embed = await this._generateEmbed(incident);

            try {

                const webhookMessage = await ((messageId && typeof messageId === 'string') ? this.webhook.editMessage(messageId, { embeds: [embed] }) : this.webhook.send({ embeds: [embed] }));

                this.incidents.set(incident.id, {

                    id: incident.id,
                    lastUpdate: DateTime.now().toISO(),
                    messageId: webhookMessage.id,
                    resolved: incident.status === 'resolved' || incident.status === 'postmortem'

                });

                await this._save();

                resolve(true);

            } catch(e) {

                reject(new DisGroupDevError(e))

            }

        });

    }

}

module.exports = StatusPageChecker;
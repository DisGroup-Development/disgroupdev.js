const EventEmitter = require('node:events');

/**
 * @typedef {Object} TempChannelData
 * @property {import('discord.js').VoiceChannel} channel The voice channel
 * @property {import('discord.js').GuildMember} owner The if of the creator of the channel
 */

/**
 * @typedef {Object} TempChannelManagerData
 * @property {import('discord.js').Snowflake} channelId The id of the temp create voice channel
 * @property {TempChannelManagerRegisterOptions} options The options of the temp create voice channel
 * @property {Array<TempChannelData>} tempChannels An array of all temp channels the temp create channel manages
 */

/**
 * @typedef {Object} TempChannelManagerRegisterOptions
 * @property {import('discord.js').Snowflake} categoryId The id of the category the channel should get created to
 * @property {?Boolean} autoDeleteIfEmpty If the channel should be deleted automatically if the channel is empty (Default: true)
 * @property {?Boolean} autoDeleteIfOwnerLeaves If the channel should be deleted automatically if the owner leaves the channel (Default: true)
 * @property {?Number} bitrate The bitrate for the channel (Default: 64000)
 * @property {Function} channelName The name of the channel (Params: member and count)
 * @property {Number} maxUsers The amount of users that can join the channel
 */

/**
 * The temp channel manager for creating and managing temporary voice channels
 */
class TempChannelManager extends EventEmitter {

    /**
     * The constructor
     * @param {import('discord.js').Client} client
     */
    constructor(client) {

        super();

        /**
         * The discord client
         * @type {import('discord.js').Client}
         */
        this.client = client;

        /**
         * A map of all temp voice channels
         * @type {Array<TempChannelManagerData>}
         * @private
         */
        this._channels = new Array();

        this.client.on('channelDelete', (channel) => this._handleChannelDelete(channel));
        this.client.on('voiceStateUpdate', (oldState, newState) => this._handleVoiceStateUpdate(oldState, newState));

    }

    /**
     * Handles a channel delete
     * @param {import('discord.js').DMChannel|import('discord.js').GuildChannel} channel 
     * @private
     */
    async _handleChannelDelete(channel) {

        const tempCreateChannel = this._channels.find((channelData) => channelData.channelId === channel.id);

        if(tempCreateChannel) {

            this._channels = this._channels.filter((channelData) => channelData.channelId !== channel.id);

            return this.emit('channelUnregistered', tempCreateChannel);

        }

        const tempCreateChannelTempChannels = this._channels.find((channelData) => channelData.tempChannels.some((channel) => channel.channel.id === channel.id));

        if(tempCreateChannelTempChannels) {

            tempCreateChannel.tempChannels = tempCreateChannel.tempChannels.filter((channel) => channel.channel.id !== channel.id);

        }

    }

    /**
     * Handles a voice state update
     * @param {import('discord.js').VoiceState} oldState 
     * @param {import('discord.js').VoiceState} newState 
     * @private
     */
    async _handleVoiceStateUpdate(oldState, newState) {

        const isDisconnected = !!oldState.channelId && !newState.channelId;
        const isJoined = !oldState.channelId && !!newState.channelId;
        const isMoved = !!oldState.channelId && !!newState.channelId && oldState.channelId !== newState.channelId;

        if(isDisconnected || isMoved) {

            const tempCreateChannel = this._channels.find((channelData) => channelData.tempChannels.some((channel) => channel.channel.id === oldState.channelId))

            if(tempCreateChannel) {

                const tempCreateChannelTempChannelToDelete = tempCreateChannel.tempChannels.find((channel) => channel.channel.id === oldState.channelId);

                if((tempCreateChannel.options.autoDeleteIfEmpty && oldState.channel.members.size === 0) || (tempCreateChannel.options.autoDeleteIfOwnerLeaves && !oldState.channel.members.has(tempCreateChannelTempChannelToDelete.owner.id))) {

                    tempCreateChannelTempChannelToDelete.channel
                        .delete()
                        .then(() => {

                            tempCreateChannel.tempChannels = tempCreateChannel.tempChannels.filter((channel) => channel.channel.id !== tempCreateChannelTempChannelToDelete.channel.id);

                            this.emit('temoVoiceChannelDeleted', newState.member, tempCreateChannelTempChannelToDelete.channel, this.client.channels.resolve(tempCreateChannel.channelId));

                        })
                        .catch((err) => {

                            this.emit('error', err), 'Unable to delete channel: ' + tempCreateChannelTempChannelToDelete.channel.id;

                        });

                }

            }

        }

        if(isJoined || isMoved) {

            const tempCreateChannel = this._channels.find((channelData) => channelData.channelId === newState.channelId);

            if(!tempCreateChannel) return;

            const tempChannelCount = tempCreateChannel.tempChannels.length + 1;
            const tempChannelName = tempCreateChannel.options.channelName(newState.member, tempChannelCount);

            const tempChannel = await newState.guild.channels.create(tempChannelName, { bitrate: tempCreateChannel.options.bitrate, parent: tempCreateChannel.options.categoryId, type: 'GUILD_VOICE', userLimit: tempCreateChannel.options.maxUsers });

            this.emit('tempVoiceChannelCreated', newState.member, tempChannel, this.client.channels.resolve(tempCreateChannel.channelId));

            newState.setChannel(tempChannel);

            tempCreateChannel.tempChannels.push({ channel: tempChannel, owner: newState.member });

        }

    }

    /**
     * Registers a channel
     * @param {import('discord.js').Snowflake} channelId The id of the temp create channel
     * @param {TempChannelManagerRegisterOptions} options The options for the temp create channel
     * @returns {Boolean}
     */
    register(channelId, options = { categoryId: null, autoDeleteIfEmpty: true, autoDeleteIfOwnerLeaves: true, bitrate: 64000, channelName: (count, member) => `#${count} | ${member}'s Lounge`, maxUsers: 0 }) {

        const channelData = {

            channelId,
            options,
            tempChannels: []

        };

        this._channels.push(channelData);
        this.emit('channelRegistered', channelData);

        return true;

    }

    /**
     * Unregisters a channel
     * @param {import('discord.js').Snowflake} channelId The id of the temp create channel
     * @returns {Boolean|null}
     */
    unregister(channelId) {

        const channel = this._channels.find((channel) => channel.channelId === channelId);

        if(!channel) return null;

        this._channels = this._channels.filter((channel) => channel.channelId !== channelId);
        this.emit('channelUnregeistered', channel);

        return true;

    }

}

module.exports = TempChannelManager;
const Constants = require('./Constants');
const Discord = require('discord.js');
const DiscordAPITypes = require('discord-api-types/v10');
const Errors = require('./Errors');

/**
 * Some useful utilities
 */
class Utilities {

    constructor() {

        this.REGEXES = {

            Channel: DiscordAPITypes.FormattingPatterns.Channel,
            ChannelMention: new RegExp('/^<#(?<id>\d{17,19})>$/'),
            ChannelMessageMention: new RegExp('/^(?<channelId>\d{17,19})-(?<messageId>\d{17,19})$/'),
            DiscordHostname: new RegExp('/(?<subdomain>\w+)\.?(?<hostname>dis(?:cord)?(?:app|merch|status)?)\.(?<tld>com|g(?:d|g|ift)|(?:de(?:sign|v))|media|new|store|net)/i'),
            DiscordInvite: new RegExp('/^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg\/|discord(?:app)?\.com\/invite\/)?(?<code>[\w\d-]{2,})$/i'),
            Emoji: DiscordAPITypes.FormattingPatterns.Emoji,
            EmojiAnimated: DiscordAPITypes.FormattingPatterns.AnimatedEmoji,
            EmojiStatic: DiscordAPITypes.FormattingPatterns.StaticEmoji,
            Http: new RegExp('/^https?:\/\//'),
            MessageLink: new RegExp('/^(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?<guildId>(?:\d{17,19}|@me))\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})$/'),
            Role: DiscordAPITypes.FormattingPatterns.Role,
            RoleMention: new RegExp('/^<@&(?<id>\d{17,19})>$/'),
            Snowflake: new RegExp('/^(?<id>\d{17,19})$/'),
            Timestamp: DiscordAPITypes.FormattingPatterns.Timestamp,
            TimestampStyled: DiscordAPITypes.FormattingPatterns.StyledTimestamp,
            Token: new RegExp('/(?<mfaToken>mfa\.[a-z0-9_-]{20,})|(?<basicToken>[a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27})/i'),
            User: DiscordAPITypes.FormattingPatterns.User,
            UserOrMemberMention: new RegExp('/^<@!?(?<id>\d{17,19})>$/'),
            UserWithNickname: DiscordAPITypes.FormattingPatterns.UserWithNickname,
            UserWithOptionalNickname: DiscordAPITypes.FormattingPatterns.UserWithOptionalNickname,
            Webhook: new RegExp('/(?<url>^https:\/\/(?:(?:canary|ptb).)?discord(?:app)?.com\/api(?:\/v\d+)?\/webhooks\/(?<id>\d+)\/(?<token>[\w-]+)\/?$)/'),
            Websocket: new RegExp('/^wss?:\/\//'),

        } 

    }

    /**
     * Generate a progress bar for example for a player
     * @param {Number} current Where it currently is (Ms)
     * @param {Number} all Where the end is (Ms) 
     * @param {Object} options The options for generating the progeress bar
     * @returns {String}
     */
    generateProgressBar(current, all, options = { current: '🔘', length: 40, line: '▬' }) {

        const time = current / all;
        const currentProgress = Math.round(options.length * Time);
        const emptyBar = Math.round(options.length - currentProgress);
        const barText = options.line.repeat(currentProgress).replace(/.$/, options.current); 
        const emptyBarText = options.line.repeat(emptyBar);

        return barText + emptyBarText;

    }

    /**
     * Gets the locale from a guild for using the @link {TranslationManager}
     * @param {Discord.Guild} guild 
     * @returns {String}
     */
    getGuildLocale(guild) {

        switch(guild?.preferredLocale) {

            case 'de':

                return Constants.guildLocales.DE_DE;

            case 'en-US':
            default:

                return Constants.guildLocales.EN_US;

        }

    }

    /**
     * Gets you a readable date in hh.mm.ss
     * @param {Date} date
     * @returns {String}
     */
    getReadableTime(date) {

        if(Object.prototype.toString.call(date) !== '[object Date]') throw new Error(Errors.INVALID_DATE);

        function fT(d, t) {

            let _t = t;

            while(_t.toString().length < d) {

                _t = '0' + _t;

            };

            return _t;

        }

        return (fT(2, date.getHours()) + ':' + fT(2, date.getMinutes()) + ':' + fT(2, date.getSeconds()));

    }

}

module.exports = Utilities;
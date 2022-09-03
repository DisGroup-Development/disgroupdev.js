'use strict';

/**
 * Partner class.
 * @extends {null}
 * @class
 */
class Partner extends null {}

/**
 * The data of all emojis
 * @typedef {Object} EmojiData
 * @property {String} emoji The emoji
 * @property {String} id The id of the emoji
 * @property {String} name The name of the emoji
 * @property {String} url The url of the emoji
 */

/**
 * The data of all partners
 * @typedef {Object} PartnerData
 * @property {String} name The name of the partner
 * @property {TranslationData} longDescription The long description of the partner
 * @property {TranslationData} shortDescription The short description of the partner
 * @property {EmojiData} emoji The emoji of the partner
 * @property {String} owner The owner id of the partner
 * @property {TranslationData} type The type of the partner
 * @property {?String} bannerURL The banner URL of the partner
 * @property {String} iconURL The icon URL of the partner
 * @property {?String} discordURL The discord URL of the partner
 * @property {?String} instagramURL The instagram URL of the partner
 * @property {?String} twitterURL The twitter URL of the partner
 * @property {?String} websiteURL The website URL of the partner
 */

/**
 * The data of all translations
 * @typedef {Object} TranslationData
 * @property {String} language The language of the string
 */

/**
 * KernelHost
 * @memberof Partner
 * @returns {PartnerData}
 */
Partner.KERNELHOST = {

    name: 'KernelHost',
    longDescription: {

        // eslint-disable-next-line max-len
        'de-DE': 'KernelHost ist ein prepaid Server-Hoster, welcher Server mit **starker** ⚡ Performance zu einem sehr guten Preis 💸 bereitstellt. Du kannst dir KMV-Server, Minecraft-Server, Web-Server und viele weitere mieten. Die Administration 🔐 der Server ist sehr einfach, dank des schönen und übersichtlichen Dashboards. Der Support 🎧 ist sehr schnell und hilfreich.',
        // eslint-disable-next-line max-len
        'en-US': 'KernelHost is a prepaid server hoster, which offers servers with **strong** ⚡ performance at a very good price 💸. You can rent KVM servers, Minecraft servers, web servers and much more. The administration 🔐 of the servers is very easy thanks to the beautiful and clear dashboard. The support 🎧 is very fast and reliable.',

    },
    shortDescription: {

        'de-DE': 'KernelHost ist unser starker ⚡ Server-Hoster',
        'en-US': 'KernelHost is our strong ⚡ Hosting Service',

    },
    emoji: {

        emoji: '<:D_Partner_KernelHost:933714792621940778>',
        id: '933714792621940778',
        name: 'D_Partner_KernelHost',
        url: 'https://cdn.discordapp.com/emojis/933714792621940778.webp',

    },
    owner: '180969555055607808',
    type: {

        'de-DE': 'Server-Hoster',
        'en-US': 'Server Hoster',

    },
    bannerURL: 'https://www.kernelhost.com/images/logo.png',
    iconURL: 'https://www.kernelhost.com/images/favicon.png',
    discordURL: 'https://discord.gg/Chr8ZDgexb',
    instagramURL: 'https://instagram.com/kernelhost/',
    twitterURL: 'https://twitter.com/kernelhost',
    websiteURL: 'https://kernelhost.com',

};

/**
 * Lara_Gaming
 * @memberof Partner
 * @returns {PartnerData}
 */
Partner.LARAGAMING = {

    name: 'Lara_Gaming',
    longDescription: {

        'de-DE': 'Diese Beschreibung kommt bald...',
        'en-US': 'This description is coming soon...',

    },
    shortDescription: {

        'de-DE': 'Lara_Gaming ist ein Content-Creator 🎥',
        'en-US': 'Lara_Gaming is a content creator 🎥',

    },
    emoji: {

        emoji: '<:D_Partner_LaraGaming:912978738071871520>',
        id: '912978738071871520',
        name: 'D_Partner_LaraGaming',
        url: 'https://cdn.discordapp.com/emojis/912978738071871520.webp',

    },
    owner: '426764022650634250',
    type: {

        'de-DE': 'Content-Creator',
        'en-US': 'Content Creator',

    },
    bannerURL: 'https://images-ext-1.discordapp.net/external/UwmWAgNuyi3qNFufhLnDLe2CvpEOu0hxc3NC0KvoERc/https/i.ibb.co/xXNWNNM/channels4-banner-1.jpg?width=429&height=71',
    iconURL: 'https://images-ext-2.discordapp.net/external/-Xa5MZbf1XNcwTOhikaRotlUyW8FMMINh4YuiLeCzog/https/i.ibb.co/CHp0jZB/32d6d1297954b76dfae70f046937240d-modified.png?width=86&height=86',
    discordURL: 'https://discord.gg/2hk86UGXxF',
    instagramURL: 'https://instagram.com/lara.gaygirl/',
    twitterURL: 'https://twitter.com/laragaming1003',
    websiteURL: 'https://www.youtube.com/channel/UCvQn5GB7zNUP_CSZkBXDkZg',

};

module.exports = Partner;

const { StatusPageChecker } = require('../lib');
const { WebhookClient } = require('discord.js');
const { webhook_url } = require('./auth.js');

new StatusPageChecker({ colors: { BLACK: '#000000', GREEN: '#51f34d', ORANGE: '#fcb22d', RED: '#fe6b61', YELLOW: '#ffde22' }, storage: require('node:path').resolve(__dirname, './incidents.json'), url: 'https://disgroupdev.statuspage.io', webhook: new WebhookClient({ url: webhook_url }) });

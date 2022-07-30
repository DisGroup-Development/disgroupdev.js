const { EventManager } = require('../lib');
const { Client } = require('discord.js');
const { GatewayIntentBits } = require('discord-api-types/v10');
const { token } = require('./auth.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent ] });

client.events = new EventManager(client, { locationEvents: require('path').resolve(__dirname, './Events') });
client.events.loadAll();

client.login(token)

setTimeout(async () => {

    console.log(client.events.cache);

    await client.events.unloadAll();

    console.log(client.events._events);

}, 2000);
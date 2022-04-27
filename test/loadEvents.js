const { EventManager } = require('../lib');
const { Client, Intents } = require('discord.js');
const { token } = require('./auth.js');

const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });

client.events = new EventManager(client, { locationEvents: require('path').resolve(__dirname, './Events') });
client.events.loadAll();

client.login(token)

setTimeout(async () => {

    console.log(client.events._events);

    await client.events.unloadAll();

    console.log(client.events._events);

}, 2000);
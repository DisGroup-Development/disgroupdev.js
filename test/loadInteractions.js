const { InteractionManager } = require('../lib');
const { Client } = require('discord.js');
const { GatewayIntentBits } = require('discord-api-types/v10');
const { token } = require('./auth.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent ] });

client.interactions = new InteractionManager(client, { locationSlashCommands: require('node:path').join(__dirname, './Interactions/Slash') });

client.login(token)

setTimeout(async () => {

    await client.interactions.slash.loadAll();

    //console.log(client.interactions.slash.cache);

    await client.interactions.slash.unloadAll();

    console.log(client.interactions.slash.cache);

}, 2000);
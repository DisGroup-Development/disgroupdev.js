const { InteractionManager } = require('../lib');
const { Client, Intents } = require('discord.js');
const { token } = require('./auth.js');

const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });

client.interactions = new InteractionManager(client, { locationSlashCommands: require('node:path').join(__dirname, './Interactions/Slash') });

client.login(token)

setTimeout(async () => {

    await client.interactions.slash.loadAll();

    //console.log(client.interactions.slash.cache);

    await client.interactions.slash.unloadAll();

    console.log(client.interactions.slash.cache);

}, 2000);
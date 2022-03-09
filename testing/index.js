const Discord = require('discord.js');
const DisGroupDev = require('../src');

const { DISCORD_TOKEN } = require('./auth.json');
console.log(new DisGroupDev.Utilities().getReadableTime(new Date(Date.now())))
process.exit(0)
const client = new Discord.Client({ intents: [ Discord.Intents.FLAGS.GUILDS ] });

client.login(DISCORD_TOKEN);
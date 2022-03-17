const Discord = require('discord.js');
const DisGroupDev = require('../src');

const { DISCORD_TOKEN } = require('./auth.json');

const client = new Discord.Client({ intents: [ Discord.Intents.FLAGS.GUILDS ] });

client.login(DISCORD_TOKEN);
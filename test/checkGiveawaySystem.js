const { GiveawayManager } = require('../lib');
const { Client } = require('discord.js');
const { GatewayIntentBits } = require('discord-api-types/v10');
const { token } = require('./auth.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent ] });
const giveaways = new GiveawayManager(client, {

    storage: require('node:path').resolve(__dirname, './giveaways.json')

});

client.login(token)
giveaways.on('giveawayCreate', (giveaway) => {
    console.log(`giveaway #${giveaway.messageId} created`)
});
client.on('ready', async () => {
    await client.channels.fetch('902913093435265054');
    await client.users.fetch('552232329259778058')
    setTimeout(async () => {
        
        giveaways.createGiveaway('902913093435265054', '552232329259778058', {
            isDrop: true,
            prize: 'Coffee',
            reaction: '🎉'
        })

    }, 2000);
    client.on('messageReactionAdd', (r, u) => giveaways.handleMessageReactionAdd(r, u));
    client.on('messageReactionRemove', (r, u) => giveaways.handleMessageReactionRemove(r, u));
});
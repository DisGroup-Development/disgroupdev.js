const { TextTicketManager } = require('../lib');
const { Client } = require('discord.js');
const { GatewayIntentBits } = require('discord-api-types/v10');
const { token } = require('./auth.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent ] });

client.tickets = new TextTicketManager(client, {

    parentId: '915232841099526155',
    staffRoles: ['770907286515875852'],
    storage: require('node:path').join(__dirname, './tickets.json')

})

client.login(token)
client.tickets.on('ticketCreate', (ticket) => {
    console.log(`ticket #${ticket.number} created`)
});
client.on('ready', async () => {
    await client.users.fetch('552232329259778058')
    setTimeout(async () => {
        await client.tickets.createTicket('719506936810438667', '552232329259778058').then((Ticket) => {

            setTimeout(async () => {

                Ticket.close().then(() => {

                    setTimeout(async () => {

                        Ticket.reopen();
        
                    }, 5000)

                })

            }, 2000)

        })
    }, 2000)
});
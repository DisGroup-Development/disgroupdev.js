const { TextTicketManager } = require('../lib');
const { Client, Intents } = require('discord.js');
const { token } = require('./auth.js');

const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS ] });

client.tickets = new TextTicketManager(client, {

    parentId: '915232841099526155',
    staffRoles: ['770907286515875852'],
    storage: require('node:path').join(__dirname, './tickets.json')

})

client.login(token)
client.tickets.on('ticketCreate', (ticket) => {
    console.log(`ticket #${ticket.number} created`)
})
client.on('ready', async () => {
    await client.users.fetch('552232329259778058')
    setTimeout(async () => {
        await client.tickets.createTicket('719506936810438667', '552232329259778058').then((Ticket) => {

            setTimeout(() => {

                Ticket.close();

            }, 2000)

            setTimeout(() => {

                Ticket.reopen();

            }, 5000)

        })
    }, 2000)
});
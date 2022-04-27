const { Event } = require('../../lib');

class Ready extends Event {

    constructor(client, manager) {

        super(client, manager, {
            name: 'ready',
            enabled: false,
            once: false,
        });

    }

    execute(client) {

        console.log(`${client.user.tag} is ready!`);
        console.log(`Guilds: ${client.guilds.cache.size}`);
        console.log(`Users: ${client.users.cache.size}`);

    }

}

module.exports = Ready;
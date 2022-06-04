const Discord = require('discord.js');

const { SlashCommand } = require('../../../../lib');

class Ping extends SlashCommand {

    constructor(client, manager) {

        super(client, manager, {

            name: 'ping',
            description: 'pong',
            enabled: true

        });

    }

    execute(interaction) {



    }

}

module.exports = Ping;
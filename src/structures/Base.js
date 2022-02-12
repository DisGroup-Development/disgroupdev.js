const Discord = require('discord.js');
const Errors = require('../utils/Errors');

/**
 * The base of all structures
 */
class Base {

    /**
     * The constructor for the base class
     * @param {Discord.Client} client 
     */
    constructor(client) {

        if(!client instanceof Discord.Client) throw new Error(Errors.INVALID_CLIENT);

        this.client = client;

    }

}

module.exports = Base;
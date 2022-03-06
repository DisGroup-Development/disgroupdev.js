const Base = require('./Base');
const Discord = require('discord.js');
const Express = require('express');

/**
 * The base of all routers
 * @extends {Base}
 */
class Route extends Base {

    /**
     * The constructor for the router class
     * @param {Discord.Client} client
     * @param {Express.Router} router
     */
    constructor(client, router) {

        super(client);

        /**
         * The router
         * @type {Express.Router}
         * @private
         */
        this._router = router;

    }

    /**
     * The router
     * @return {Express.Router}
     */
    get router() {

        return this._router;

    }

}

module.exports = Route;
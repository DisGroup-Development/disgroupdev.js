/**
 * The DisGroupDevError
 * @class
 */
class DisGroupDevError extends Error {

    /**
     * The constructor of the DisGroupDevError class.
     * @param {String} message
     */
    constructor(message) {

        super(message);

    }

}

module.exports = {

    DisGroupDevError,
    Messages: require('./Messages')

};
const Messages = {

    INVALID_LOCATION: "An invalid location as provided. Please provide a valid location with the FULL path.",

    NOT_A_FUNCTION: (name) => `${name} is not a function. Please provide a valid function.`,
    NOT_A_STRING: (value) => `${value} is not a string. Please provide a valid string.`,

    NOT_READY: "The instance you are trying to call is not ready. Please wait till the instance is ready by checking `isReady`.",

};

module.exports = Messages;
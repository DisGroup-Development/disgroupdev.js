const Messages = {

    EVENT_NOT_FOUND: (name) => `A event with the name "${name}" not found. Please check if the event is loaded.`,

    INVALID_EXECUTE: (name) => `The event "${name}" has no execute function. Please create a execute function.`,
    INVALID_LOCATION: "An invalid location as provided. Please provide a valid location with the FULL path.",

    NOT_A_FUNCTION: (name) => `${name} is not a function. Please provide a valid function.`,
    NOT_A_STRING: (value) => `${value} is not a string. Please provide a valid string.`,

    NOT_INSTANCE_OF: (name, value) => `${value} is not an instance of ${name}. Please provide a valid instance of ${value}.`,

    NOT_READY: "The instance you are trying to call is not ready. Please wait till the instance is ready by checking `isReady`.",

};

module.exports = Messages;
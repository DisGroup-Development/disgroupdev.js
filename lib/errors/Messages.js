const Messages = {

    COMMAND_NOT_FOUND: (name) => `A command with the name "${name}" was not found. Please check if the command is loaded.`,

    EVENT_NOT_FOUND: (name) => `An event with the name "${name}" was not found. Please check if the event is loaded.`,

    INVALID_EXECUTE: (name) => `The event "${name}" has no execute function. Please create a execute function.`,
    INVALID_LOCATION: "An invalid location as provided. Please provide a valid location with the FULL path.",
    INVALID_URL: "An invalid URL as provided. Please provide a valid URL.",

    NOT_A_FUNCTION: (name) => `${name} is not a function. Please provide a valid function.`,
    NOT_A_STRING: (value) => `${value} is not a string. Please provide a valid string.`,

    NOT_ENABLED: "This function is not enabled. Please enable it to use that.",
    NOT_INSTANCE_OF: (name, value) => `${value} is not an instance of ${name}. Please provide a valid instance of ${value}.`,
    NOT_READY: "The instance you are trying to call is not ready. Please wait till the instance is ready by checking `isReady`.",

    UNRESOLVABLE_GUILD: (guildId) => `An guild with the id "${guildId}" couldn't get resolved. Please check if the guild id is resolvable.`,

};

module.exports = Messages;
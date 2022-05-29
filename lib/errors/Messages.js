const Messages = {

    BUTTON_INTERACTION_NOT_FOUND: (name) => `A button interaction with the name "${name}" was not found. Please check if the button interaction is loaded.`,

    COMMAND_NOT_FOUND: (name) => `A command with the name "${name}" was not found. Please check if the command is loaded.`,

    CONTEXT_INTERACTION_NOT_FOUND: (name) => `A context interaction with the name "${name}" was not found. Please check if the context interaction is loaded.`,

    EVENT_NOT_FOUND: (name) => `An event with the name "${name}" was not found. Please check if the event is loaded.`,

    INVALID_DATE: "An invalid date was provided. Please provide a valid date.",
    INVALID_EXECUTE: (name) => `The event "${name}" has no execute function. Please create a execute function.`,
    INVALID_LOCATION: "An invalid location was provided. Please provide a valid location with the FULL path.",
    INVALID_URL: "An invalid URL aas provided. Please provide a valid URL.",

    MODAL_INTERACTION_CANT_REPLY_TO_MODAL_SUBMIT: 'A ModalSubmitInteraction can\'t be replied with a modal.',
    MODAL_INTERACTION_NOT_FOUND: (name) => `A modal interaction with the name "${name}" was not found. Please check if the modal interaction is loaded.`,

    NOT_A_FUNCTION: (name) => `${name} is not a function. Please provide a valid function.`,
    NOT_A_STRING: (name) => `${name} is not a string. Please provide a valid string.`,

    NOT_ENABLED: "This function is not enabled. Please enable it to use that.",
    NOT_INSTANCE_OF: (name, value) => `${value} is not an instance of ${name}. Please provide a valid instance of ${value}.`,
    NOT_READY: "The instance you are trying to call is not ready. Please wait till the instance is ready by checking `isReady`.",

    SELECT_MENU_INTERACTION_NOT_FOUND: (name) => `A select menu interaction with the name "${name}" was not found. Please check if the select menu interaction is loaded.`,

    UNRESOLVABLE_GUILD: (guildId) => `An guild with the id "${guildId}" couldn't get resolved. Please check if the guild id is resolvable.`,

};

module.exports = Messages;
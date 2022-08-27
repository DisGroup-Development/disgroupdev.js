const Messages = {

    BUTTON_INTERACTION_NOT_FOUND: (name) => `A button interaction with the name "${name}" was not found. Please check if the button interaction is loaded.`,

    COMMAND_NOT_FOUND: (name) => `A command with the name "${name}" was not found. Please check if the command is loaded.`,

    CONTEXT_INTERACTION_NOT_FOUND: (name) => `A context interaction with the name "${name}" was not found. Please check if the context interaction is loaded.`,

    EVENT_NOT_ENABLED: 'The event is not enabled to be loaded in. Set #enabled to true to enable loading.',
    EVENT_NOT_FOUND: (name) => `An event with the name "${name}" was not found. Please check if the event is loaded.`,

    GIVEAWAY_ALREADY_ENDED: (messageId) => `The giveaway with the message id "${messageId}" ended already. Please make sure you use a giveaway which is still running.`,
    GIVEAWAY_ALREADY_PAUSED: (messageId) => `The giveaway with the message id "${messageId}" is already paused. Please make sure you use a giveaway which is still running.`,
    GIVEAWAY_INVALID_CHANNEL: "An invalid channel was provided. Please provide a text-based channel to create a giveaway.",
    GIVEAWAY_INVALID_DROP: "Drop giveaways cannot be paused, resumed or rerolled. Please check if the giveaway is a drop giveaway by using giveaway#isDrop before running these functions.",
    GIVEAWAY_INVALID_START_OPTIONS: "An invalid giveaway start options were provided. Please provide valid giveaway start options",
    GIVEAWAY_INVALID_USER: "An invalid user was provided. Please provide a valid user to create a giveaway.",
    GIVEAWAY_MISSING_MESSAGE: (messageId) => `Unable to fetch the message with the id "${messageId}" from the giveaway. Please check if the message still exists.`,
    GIVEAWAY_MISSING_REACTION: (messageId) => `The reaction on the giveaway with the message id "${messageId}" couldn't be found. Please make sure the reaction still exists on the message.`,
    GIVEAWAY_MISSING_USERS: (messageId) => `Unable to fetch the users from the giveaway with the message id "${messageId}". Please check if any users reacted with the message.`,
    GIVEAWAY_STILL_RUNNING: (messageId) => `The giveaway with the message id "${messageId}" is still running. Please end the giveaway.`,

    INTERACTION_NOT_ENABLED: 'The interaction is not enabled to be loaded in. Set #enabled to true to enable loading.',

    INVALID_DATE: "An invalid date was provided. Please provide a valid date.",
    INVALID_EXECUTE: (name) => `The event "${name}" has no execute function. Please create a execute function.`,
    INVALID_JSON: "The json file is not properly formatted. Please check the json file.",
    INVALID_LOCATION: "An invalid location was provided. Please provide a valid location with the FULL path.",
    INVALID_URL: "An invalid URL aas provided. Please provide a valid URL.",

    MODAL_INTERACTION_CANT_REPLY_TO_MODAL_SUBMIT: 'A ModalSubmitInteraction can\'t be replied with a modal.',
    MODAL_INTERACTION_NOT_FOUND: (name) => `A modal interaction with the name "${name}" was not found. Please check if the modal interaction is loaded.`,

    NOT_A_BOOLEAN: (name) => `${name} is not a boolean. Please provide a valid boolean.`,
    NOT_A_FUNCTION: (name) => `${name} is not a function. Please provide a valid function.`,
    NOT_A_NUMBER: (name) => `${name} is not a number. Please provide a valid number.`,
    NOT_A_STRING: (name) => `${name} is not a string. Please provide a valid string.`,

    NOT_ENABLED: "This function is not enabled. Please enable it to use that.",
    NOT_INSTANCE_OF: (name, value) => `${value} is not an instance of ${name}. Please provide a valid instance of ${value}.`,
    NOT_READY: "The instance you are trying to call is not ready. Please wait till the instance is ready by checking \"isReady\".",

    SELECT_MENU_INTERACTION_NOT_FOUND: (name) => `A select menu interaction with the name "${name}" was not found. Please check if the select menu interaction is loaded.`,

    TICKET_CLOSED: (ticketNumber) => `The ticket #${ticketNumber} is already closed. Please reopen the ticket before you try to close it again.`,
    TICKET_OPEN: (ticketNumber) => `The ticket #${ticketNumber} is already open. Please close the ticket before you try to open it again.`,

    UNRESOLVABLE_CATEGORY: (guildId, channelId) => `An guild category channel with the id "${channelId}" couldn't get resolved in the guild with the id "${guildId}". Please check if the guild id is resolvable and the channel id is resolvable.`,
    UNRESOLVABLE_GUILD: (guildId) => `An guild with the id "${guildId}" couldn't get resolved. Please check if the guild id is resolvable.`,
    UNRESOLVABLE_GUILD_MEMBER: (guildId, userId) => `An guild member with the id "${userId}" couldn't get resolved in the guild with the id "${guildId}". Please check if the guild id is resolvable and the member id is resolvable.`,
    UNRESOLVABLE_MESSAGE: (messageId) => `An message with the id "${messageId} couldn't get resolved. Please check if the message id is resolvable."`,
    UNRESOLVABLE_ROLE: (guildId, roleId) => `An guild role with the id "${roleId}" couldn't get resolved in the guild with the id "${guildId}". Please check if the guild id is resolvable and the role id is resolvable.`,
    UNRESOLVABLE_USER: (userId) => `A user with the id "${userId}" couldn't get resolved. Please check if the user id is resolvable.`,

};

module.exports = Messages;
module.exports = {

    DisGroupDevError: require('./errors/DisGroupDevError'),
    ErrorMessages: require('./errors/Messages'),

    EventManager: require('./managers/EventManager'),
    InteractionManager: require('./managers/InteractionManager'),
    SlashCommandInteractionManager: require('./managers/interaction/SlashCommandInteractionManager'),
    StatusPageChecker: require('./managers/StatusPageChecker'),
    TranslationManager: require('./managers/TranslationManager'),

    BaseComponent: require('./structures/interaction/BaseComponent'),
    BaseInteraction: require('./structures/interaction/BaseInteraction'),
    ContextInteraction: require('./structures/interaction/ContextInteraction'),
    Event: require('./structures/Event'),
    SlashCommand: require('./structures/interaction/SlashCommand'),

    Badges: require('./utils/Badges'),
    Colors: require('./utils/Colors'),
    Emojis: require('./utils/Emojis'),
    Logger: require('./utils/Logger'),
    Partner: require('./utils/Partner'),
    Utilities: require('./utils/Utilities'),

}
module.exports = {

    ButtonInteractionManager: require('./managers/ButtonInteractionManager'),
    CommandManager: require('./managers/CommandManager'),
    EventManager: require('./managers/EventManager'),
    InteractionManager: require('./managers/InteractionManager'),
    MenuInteractionManager: require('./managers/MenuInteractionManager'),
    MessageInteractionManager: require('./managers/MessageInteractionManager'),
    ModalInteractionManager: require('./managers/ModalInteractionManager'),
    SlashCommandManager: require('./managers/SlashCommandManager'),
    TranslationManager: require('./managers/TranslationManager'),
    UserInteractionManager: require('./managers/UserInteractionManager'),

    Base: require('./structures/Base'),
    BaseCommand: require('./structures/BaseCommand'),
    BaseInteraction: require('./structures/BaseInteraction'),
    ButtonInteraction: require('./structures/ButtonInteraction'),
    Command: require('./structures/Command'),
    Event: require('./structures/Event'),
    MenuInteraction: require('./structures/MenuInteraction'),
    MessageInteraction: require('./structures/MessageInteraction'),
    ModalInteraction: require('./structures/ModalInteraction'),
    Route: require('./structures/Route'),
    SlashCommand: require('./structures/SlashCommand'),
    UserInteraction: require('./structures/UserInteraction'),

    Badges: require('./utils/Badges'),
    Colors: require('./utils/Colors'),
    Errors: require('./utils/Errors'),
    Logger: require('./utils/Logger'),
    Partner: require('./utils/Partner')

}
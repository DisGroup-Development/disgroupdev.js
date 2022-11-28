'use strict';

module.exports = {

    DisGroupDevError: require('./errors/DisGroupDevError'),
    ErrorMessages: require('./errors/Messages'),

    BaseTicketManager: require('./managers/BaseTicketManager'),
    ButtonInteractionManager: require('./managers/interaction/ButtonInteractionManager'),
    ContextInteractionManager: require('./managers/interaction/ContextInteractionManager'),
    EventManager: require('./managers/EventManager'),
    GiveawayManager: require('./managers/GiveawayManager'),
    InteractionManager: require('./managers/InteractionManager'),
    ModalInteractionManager: require('./managers/interaction/ModalInteractionManager'),
    SelectMenuInteractionManager: require('./managers/interaction/SelectMenuInteractionManager'),
    SlashCommandInteractionManager: require('./managers/interaction/SlashCommandInteractionManager'),
    StatusPageChecker: require('./managers/StatusPageChecker'),
    TextTicketManager: require('./managers/TextTicketManager'),
    TranslationManager: require('./managers/TranslationManager'),

    BaseComponent: require('./structures/interaction/BaseComponent'),
    BaseInteraction: require('./structures/interaction/BaseInteraction'),
    ButtonInteraction: require('./structures/interaction/ButtonInteraction'),
    Captcha: require('./structures/Captcha'),
    ContextInteraction: require('./structures/interaction/ContextInteraction'),
    Event: require('./structures/Event'),
    Giveaway: require('./structures/Giveaway'),
    ModalInteraction: require('./structures/interaction/ModalInteraction'),
    SelectMenuInteraction: require('./structures/interaction/SelectMenuInteraction'),
    SlashCommand: require('./structures/interaction/SlashCommand'),
    TextTicket: require('./structures/TextTicket'),

    Badges: require('./utils/Badges'),
    Colors: require('./utils/Colors'),
    Emojis: require('./utils/Emojis'),
    Logger: require('./utils/Logger'),
    Partner: require('./utils/Partner'),
    Utilities: require('./utils/Utilities'),

};

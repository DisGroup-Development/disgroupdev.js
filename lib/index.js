module.exports = {

    EventManager: require('./managers/EventManager'),
    InteractionManager: require('./managers/InteractionManager'),
    SlashCommandInteractionManager: require('./managers/interaction/SlashCommandInteractionManager'),
    StatusPageChecker: require('./managers/StatusPageChecker'),
    TranslationManager: require('./managers/TranslationManager'),

    Event: require('./structures/Event'),
    SlashCommand: require('./structures/interaction/SlashCommand')

}
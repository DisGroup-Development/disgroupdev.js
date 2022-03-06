const ButtonInteractionManager = require('./managers/ButtonInteractionManager');
const CommandManager = require('./managers/CommandManager');
const EventManager = require('./managers/EventManager');
const InteractionManager = require('./managers/InteractionManager');
const MenuInteractionManager = require('./managers/MenuInteractionManager');
const MessageInteractionManager = require('./managers/MessageInteractionManager');
const ModalInteractionManager = require('./managers/ModalInteractionManager');
const SlashCommandManager = require('./managers/SlashCommandManager');
const TranslationManager = require('./managers/TranslationManager');
const UserInteractionManager = require('./managers/UserInteractionManager');

const Base = require('./structures/Base');
const BaseCommand = require('./structures/BaseCommand');
const BaseInteraction = require('./structures/BaseInteraction');
const ButtonInteraction = require('./structures/ButtonInteraction');
const Command = require('./structures/Command');
const Event = require('./structures/Event');
const MenuInteraction = require('./structures/MenuInteraction');
const MessageInteraction = require('./structures/MessageInteraction');
const ModalInteraction = require('./structures/ModalInteraction');
const Route = require('./structures/Route');
const SlashCommand = require('./structures/SlashCommand');
const UserInteraction = require('./structures/UserInteraction');

const Badges = require('./utils/Badges');
const Colors = require('./utils/Colors');
const Errors = require('./utils/Errors');
const Logger = require('./utils/Logger');
const Partner = require('./utils/Partner');

module.exports = {

    Badges, 
    Colors,
    Errors,
    Logger,
    Partner,

    ButtonInteractionManager,
    CommandManager,
    EventManager,
    InteractionManager,
    MenuInteractionManager,
    MessageInteractionManager,
    ModalInteractionManager,
    SlashCommandManager,
    TranslationManager,
    UserInteractionManager,

    Base,
    BaseCommand,
    BaseInteraction,
    ButtonInteraction,
    Command,
    Event,
    MenuInteraction,
    MessageInteraction,
    ModalInteraction,
    Route,
    SlashCommand,
    UserInteraction

}
const ButtonInteractionManager = require('./manager/ButtonInteractionManager');
const CommandManager = require('./manager/CommandManager');
const EventManager = require('./manager/EventManager');
const InteractionManager = require('./manager/InteractionManager');
const MenuInteractionManager = require('./manager/MenuInteractionManager');
const MessageInteractionManager = require('./manager/MessageInteractionManager');
const ModalInteractionManager = require('./manager/ModalInteractionManager');
const SlashCommandManager = require('./manager/SlashCommandManager');
const TranslationManager = require('./manager/TranslationManager');
const UserInteractionManager = require('./manager/UserInteractionManager');

const Base = require('./structures/Base');
const BaseCommand = require('./structures/BaseCommand');
const BaseInteraction = require('./structures/BaseInteraction');
const ButtonInteraction = require('./structures/ButtonInteraction');
const Command = require('./structures/Command');
const Event = require('./structures/Event');
const MenuInteraction = require('./structures/MenuInteraction');
const MessageInteraction = require('./structures/MessageInteraction');
const ModalInteraction = require('./structures/ModalInteraction');
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
    SlashCommand,
    UserInteraction

}
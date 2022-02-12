const Badges = require('./utils/Badges');
const Colors = require('./utils/Colors');
const Partner = require('./utils/Partner');

const ButtonInteractionManager = require('./manager/ButtonInteractionManager');
const InteractionManager = require('./manager/InteractionManager');
const MenuInteractionManager = require('./manager/MenuInteractionManager');
const MessageInteractionManager = require('./manager/MessageInteractionManager');
const ModalInteractionManager = require('./manager/ModalInteractionManager');
const SlashCommandManager = require('./manager/SlashCommandManager');
const UserInteractionManager = require('./manager/UserInteractionManager');

const Base = require('./structures/Base');
const BaseCommand = require('./structures/BaseCommand');
const BaseInteraction = require('./structures/BaseInteraction');
const ButtonInteraction = require('./structures/ButtonInteraction');
const MenuInteraction = require('./structures/MenuInteraction');
const MessageInteraction = require('./structures/MessageInteraction');
const SlashCommand = require('./structures/SlashCommand');
const UserInteraction = require('./structures/UserInteraction');

module.exports = {

    Badges, 
    Colors,
    Partner,

    ButtonInteractionManager,
    InteractionManager,
    MenuInteractionManager,
    MessageInteractionManager,
    ModalInteractionManager,
    SlashCommandManager,
    UserInteractionManager,

    Base,
    BaseCommand,
    BaseInteraction,
    ButtonInteraction,
    MenuInteraction,
    MessageInteraction,
    SlashCommand,
    UserInteraction

}
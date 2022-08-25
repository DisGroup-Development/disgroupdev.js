import {
    ApplicationCommandOptionData,
    Client,
    Collection,
    ColorResolvable,
    EmojiIdentifierResolvable,
    Guild,
    GuildMember,
    GuildMemberResolvable,
    GuildResolvable,
    Message,
    MessageMentionOptions,
    MessageReaction,
    Snowflake,
    TextBasedChannelTypes,
    TextChannel,
    User,
    UserResolvable,
    WebhookClient
} from 'discord.js';
import { APIMessageComponentEmoji, ApplicationCommandType, ButtonStyle, LocalizationMap, PermissionFlagsBits } from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, EmbedFooterOptions, ModalBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder } from '@discordjs/builders';
import { EventEmitter } from 'node:events';
import { InitOptions } from 'i18next';

export class BaseComponent {

    public constructor(client: Client, data: BaseComponentData);
    public client: Client;
    public cooldowns: Map<Snowflake, Boolean>;
    private data: BaseComponentData;

    public get betaOnly(): Boolean;
    public get category(): String;
    public get channelOnly(): Array<TextBasedChannelTypes>;
    public get clientPermissions(): Array<PermissionFlagsBits>;
    public get cooldown(): Number;
    public get customId(): String | null;
    public get defer(): Boolean;
    public get devOnly(): Boolean;
    public get dirname(): String;
    public get enabled(): Boolean;
    public get ephemeral(): Boolean;
    public get experiment(): ExperimentData;
    public get guildOnly(): Boolean;
    public get location(): String;
    public set location(path: String);
    public get name(): String | null;
    public get nsfw(): Boolean;
    public get ownerOnly(): Boolean;
    public get premiumOnly(): Boolean;
    public get userPermissions(): Array<PermissionFlagsBits>;
    public toJSON(): BaseComponentData;

}

export interface BaseComponentData {

    name: String;
    enabled: Boolean;
    clientPermissions: Array<PermissionFlagsBits>;
    userPermissions: Array<PermissionFlagsBits>;
    category: String;
    cooldown: Number;
    customId: String;
    defer: Boolean;
    dirname: String;
    ephemeral: Boolean;
    experiment: ExperimentData;
    location: String;
    betaOnly: Boolean;
    channelOnly: Array<TextBasedChannelTypes>;
    devOnly: Boolean;
    guildOnly: Boolean;
    ownerOnly: Boolean;
    premiumOnly: Boolean;
    nsfw: Boolean;

}

export class BaseInteraction {

    public constructor(client: Client, data: BaseInteractionData);
    public client: Client;
    public cooldowns: Map<Snowflake, Boolean>;
    private data: BaseInteractionData;

    public get betaOnly(): Boolean;
    public get category(): String;
    public get channelOnly(): Array<TextBasedChannelTypes>;
    public get clientPermissions(): Array<PermissionFlagsBits>;
    public get cooldown(): Number;
    public get defer(): Boolean;
    public get defaultMemberPermissions(): Array<PermissionFlagsBits>;
    public get deployEnabled(): Boolean;
    public get devOnly(): Boolean;
    public get dirname(): String;
    public get enabled(): Boolean;
    public get ephemeral(): Boolean;
    public get experiment(): ExperimentData;
    public get guildOnly(): Boolean;
    public get id(): Snowflake | null;
    public set id(id: Snowflake);
    public get location(): String;
    public set location(path: String);
    public get name(): String | null;
    public get nameLocalizations(): LocalizationMap | null;
    public get nsfw(): Boolean;
    public get ownerOnly(): Boolean;
    public get premiumOnly(): Boolean;
    public get type(): ApplicationCommandType | null;
    public get userPermissions(): Array<PermissionFlagsBits>;
    public toJSON(): BaseInteractionData;

}

export interface BaseInteractionData {

    name: String;
    nameLocalizations: LocalizationMap;
    enabled: Boolean;
    clientPermissions: Array<PermissionFlagsBits>;
    userPermissions: Array<PermissionFlagsBits>;
    category: String;
    cooldown: Number;
    defaultMemberPermissions: Array<PermissionFlagsBits>;
    deployEnabled: Boolean;
    defer: Boolean;
    dirname: String;
    ephemeral: Boolean;
    experiment: ExperimentData;
    id: Snowflake | null;
    location: String;
    type: ApplicationCommandType | null;
    betaOnly: Boolean;
    channelOnly: Array<TextBasedChannelTypes>;
    devOnly: Boolean;
    guildOnly: Boolean;
    ownerOnly: Boolean;
    premiumOnly: Boolean;
    nsfw: Boolean;

}

export class BaseTicket {

    public constructor(client: Client, manager: BaseTicketManager, data: TicketDataRaw);
    public client: Client;
    public manager: BaseTicketManager;
    private data: TicketDataRaw;

    public get channel(): TextChannel;
    public get channelId(): Snowflake;
    public get guild(): Guild;
    public get guildId(): SNowflake;
    public get member(): GuildMember;
    public get number(): Number;
    public get participants(): Array<Snowflake>;
    public get status(): TicketDataStatus;
    public get type(): TicketDataType;
    public get user(): User;
    public get userId(): Snowflake;

}

export class BaseTicketManager extends EventEmitter {

    public constructor(client: Client, data: BaseTicketManagerOptions);
    public client: Client;
    public options: BaseTicketManagerOptions;
    private _rawTickets: Array<TicketDataRaw>;
    public isReady: Boolean;

    private _getTickets(): Array<TicketDataRaw> | DisGroupDevError;

    public checkDoubleTickets(guildId: Snowflake, userId: Snowflake): Boolean;
    public resolveGuild(guild: GuildResolvable): Guild | null;
    public resolveUser(user: UserResolvable): User | null;
    public save(): Boolean | DisGroupDevError;

}

export interface BaseTicketManagerOptions {

    staffRoles: Array<Snowflake>;
    storage: String;

}

export class ButtonInteraction extends BaseComponent {

    public constructor(client: Client, manager: InteractionManager, data: ButtonInteractionData);
    public client: Client;
    public manager: ButtonInteractionManager;
    private data: ButtonInteractionData;

    public buildButton(): ButtonBuilder | DisGroupDevError;
    public get disabled(): Boolean;
    public get emoji(): APIMessageComponentEmoji | null;
    public get label(): String;
    public get style(): ButtonStyle;
    public get url(): URL | null;

}

export interface ButtonInteractionData {

    disabled: Boolean;
    emoji: APIMessageComponentEmoji | null;
    label: String;
    style: ButtonStyle;
    url: URL | null;

}

export class ButtonInteractionManager {

    public constructor(client: Client, interactionManager: InteractionManager);
    public cache: Collection<String, ButtonInteraction>;
    public client: Client;
    public manager: InteractionManager;

    public load(path: String): Promise<Boolean | DisGroupDevError>;
    public loadAll(): Promise<Boolean | DisGroupDevError>;
    public reload(name: String): Promise<Boolean | DisGroupDevError>;
    public reloadAll(): Promise<Boolean | DisGroupDevError>;
    public unload(name: String): Promise<Boolean | DisGroupDevError>;
    public unloadAll(): Promise<Boolean | DisGroupDevError>;

}

export class ContextInteraction extends BaseInteraction {

    public constructor(client: Client, manager: ContextInteractionManager, data: ContextInteractionData);
    public client: Client;
    public manager: ContextInteractionManager;
    private data: ContextInteractionData;

    public deploy(): Promise<Boolean | DisGroupDevError>;
    public load(): Promise<Boolean | DisGroupDevError>;
    public reload(): Promise<Boolean | DisGroupDevError>;
    public unload(): Promise<Boolean | DisGroupDevError>;

}

export interface ContextInteractionData extends BaseInteractionData {

    type: ApplicationCommandType;

}

export class ContextInteractionManager {

    public constructor(client: Client, interactionManager: InteractionManager);
    public cache: Collection<String, ContextInteraction>;
    public client: Client;
    public manager: InteractionManager;

    public deploy(contextInteraction: ContextInteraction): Promise<Boolean | DisGroupDevError>;
    public deployAll(): Promise<Boolean | DisGroupDevError>;
    public load(path: String): Promise<Boolean | DisGroupDevError>;
    public loadAll(): Promise<Boolean | DisGroupDevError>;
    public reload(name: String): Promise<Boolean | DisGroupDevError>;
    public reloadAll(): Promise<Boolean | DisGroupDevError>;
    public unload(name: String): Promise<Boolean | DisGroupDevError>;
    public unloadAll(): Promise<Boolean | DisGroupDevError>;

}

export class DisGroupDevError extends Error {}

export class Event {

    public constructor(client: Client, manager: EventManager, data: EventData);
    public client: Client;
    public manager: EventManager;
    private data: EventData;

    public get enabled(): Boolean;
    public load(): Promise<Boolean | DisGroupDevError>;
    public get location(): String;
    public set location(path: String);
    public get name(): String | null;
    public get once(): Boolean;
    public reload(): Promise<Boolean | DisGroupDevError>;
    public unload(): Promise<Boolean | DisGroupDevError>;
    public toJSON(): EventData;

}

export interface EventData {

    enabled: Boolean;
    name: String;
    once: Boolean;
    location: String;

}

export class EventManager extends EventEmitter {

    public constructor(client: Client, options: EventManagerOptions);
    public cache: Collection<String, Event>;
    public client: Client;
    public options: EventManagerOptions;

    public load(path: String): Promise<Boolean | DisGroupDevError>;
    public loadAll(): Promise<Boolean | DisGroupDevError>;
    public reload(name: String): Promise<Boolean | DisGroupDevError>;
    public reloadAll(): Promise<Boolean | DisGroupDevError>;
    public unload(name: String): Promise<Boolean | DisGroupDevError>;
    public unloadAll(): Promise<Boolean | DisGroupDevError>;

    public on<K extends keyof EventManagerEvents>(event: K, listener: (...args: EventManagerEvents[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
        event: Exclude<S, keyof EventManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public once<K extends keyof EventManagerEvents>(event: K, listener: (...args: EventManagerEvents[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
        event: Exclude<S, keyof EventManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public emit<K extends keyof EventManagerEvents>(event: K, ...args: EventManagerEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof EventManagerEvents>, ...args: unknown[]): boolean;

    public off<K extends keyof EventManagerEvents>(event: K, listener: (...args: EventManagerEvents[K]) => Awaitable<void>): this;
    public off<S extends string | symbol>(
        event: Exclude<S, keyof EventManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public removeAllListeners<K extends keyof EventManagerEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof EventManagerEvents>): this;

}

export interface EventManagerEvents {

    eventLoad: [event: Event],
    eventReload: [event: Event],
    eventUnload: [name: String],

}

export interface EventManagerOptions {

    locationEvents: String;

}

export interface ExperimentData {

    required: Boolean;
    id: Number | null;

}

export class Giveaway {

    public constructor(client: Client, manager: GiveawayManager, data: GiveawayData);
    public client: Client;
    private endTimeout: Function | null;
    public manager: GiveawayManager;
    private message: Message | null
    private data: GiveawayData;

    private _fillInEmbed(emb: EmbedBuilder): EmbedBuilder;
    private _fillInString(str: String): String;
    public get allowedMentions(): MessageMentionOptions | null;
    public get botsCanWin(): Boolean;
    public get channelId(): Snowflake | null;
    public checkWinnerEntry(user: User): Promise<Boolean>;
    public get duration(): Number;
    public edit(data: GiveawayEditData): Promise<Giveaway>;
    public get embedColor(): Number;
    public get embedColorEnded(): Number;
    public end(): Promise<Array<User>>;
    public get endAt(): Number;
    public get ended(): Boolean;
    private ensureEndTimeout(): Function | null;
    public get exceptMembers(): Array<Snowflake>;
    public get exceptPermissions(): Array<PermissionFlagsBits>;
    public fetchAllEntries(): Promise<Collection<Snowflake, User>|DisGroupDevError>;
    public fetchMessage(): Promise<Message|DisGroupDevError>;
    public get guildId(): Snowflake | null;
    public get hostedBy(): String | null;
    public get image(): String | null;
    public get isDrop(): Boolean;
    public get lastChance(): GiveawayLastChanceData;
    public get messageId(): Snowflake | null;
    public get messageReaction(): MessageReaction | null;
    public get messageURL(): String;
    public get messages(): GiveawayMessagesData;
    public pause(options: GiveawayPauseData): Promise<Givewaway>;
    public get pauseOptions(): GiveawayPauseData;
    public get prize(): String | null;
    public get reaction(): EmojiIdentifierResolvable;
    public get remainingTime(): Number;
    public reroll(options: GiveawayRerollOptions): Promise<Array<User>>;
    public roll(): Promise<User>;
    public get startAt(): Number;
    public get thumbnail(): String | null;
    public unpause(): Promise<Giveaway>;
    public get winnerIds(): Array<Snowflake>;
    public get winners(): Number;
    public toJSON(): GiveawayData;

}

export interface GiveawayData {

    allowedMentions?: MessageMentionOptions,
    botsCanWin?: Boolean,
    channelId: Snowflake,
    embedColor?: ColorResolvable,
    embedColorEnded?: ColorResolvable,
    endAt: Number,
    ended: Boolean,
    exceptMembers: Array<Snowflake>,
    exceptPermissions: Array<PermissionFlagsBits>,
    guildId: Snowflake,
    hostedBy?: String,
    image?: String,
    isDrop?: Boolean,
    lastChance?: GiveawayLastChanceData
    messageId: Snowflake,
    messages?: GiveawayMessagesData,
    pause?: GiveawayPauseData,
    prize: String,
    reaction: EmojiIdentifierResolvable,
    startAt: Number,
    thumbnail?: String,
    winnerIds?: Array<Snowflake>,
    winners: Number

}

export interface GiveawayEditData {

    addTime?: Number,
    exceptMembers?: Array<Snowflake>,
    exceptPermissions?: Array<PermissionFlagsBits>,
    image?: String,
    lastChange?: GiveawayLastChanceData,
    messages?: GiveawayMessagesData,
    prize?: String,
    thumbnail?: String,
    timestamp?: String,
    winners?: Number

}

export interface GiveawayLastChanceData {

    embedColor?: ColorResolvable,
    enabled?: Boolean,
    message?: String,
    time?: Number

}

export interface GiveawayMessagesData {

    drawing?: String,
    drop?: String,
    endedAt?: String,
    footer?: EmbedFooterOptions,
    giveaway?: String,
    giveawayEnded?: String,
    hostedBy?: String,
    noWinner?: String,
    reactToParticipate?: String,
    title?: String,
    winMessage?: String,
    winners?: String

}

export interface GiveawayPauseData {

    durationAfterPause?: Number,
    embedColor?: ColorResolvable,
    infiniteDurationText?: String,
    isPaused?: Boolean,
    message?: String,
    unpauseAfter?: Number

}

export interface GiveawayRerollOptions {

    messages: {
        congrat?: String,
        error?: String
    },
    winners?: Number

}

export class GiveawayManager {



}

export interface GiveawayManagerEvents {

    

}

export interface GiveawayManagerOptions {



}

export class InteractionManager extends EventEmitter {

    public constructor(client: Client, options: InteractionManagerOptions);
    public client: Client;
    public options: InteractionManagerOptions;
    public button: ButtonInteractionManager | null;
    public context: ContextInteractionManager | null;
    public modal: ModalInteractionManager | null;
    public selectMenu: SelectMenuInteractionManager | null;
    public slash: SlashCommandInteractionManager | null;

    public deployAll(): Promise<Boolean | DisGroupDevError>;
    public loadAll(): Promise<Boolean | DisGroupDevError>;
    public reloadAll(): Promise<Boolean | DisGroupDevError>;
    public unloadAll(): Promise<Boolean | DisGroupDevError>;

    public on<K extends keyof InteractionManagerEvents>(event: K, listener: (...args: InteractionManagerEvents[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
        event: Exclude<S, keyof InteractionManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public once<K extends keyof InteractionManagerEvents>(event: K, listener: (...args: InteractionManagerEvents[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
        event: Exclude<S, keyof InteractionManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public emit<K extends keyof InteractionManagerEvents>(event: K, ...args: InteractionManagerEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof InteractionManagerEvents>, ...args: unknown[]): boolean;

    public off<K extends keyof InteractionManagerEvents>(event: K, listener: (...args: InteractionManagerEvents[K]) => Awaitable<void>): this;
    public off<S extends string | symbol>(
        event: Exclude<S, keyof InteractionManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public removeAllListeners<K extends keyof InteractionManagerEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof InteractionManagerEvents>): this;

}

export interface InteractionManagerEvents {

    buttonInteractionLoad: [buttonInteraction: ButtonInteraction];
    buttonInteractionReload: [buttonInteraction: ButtonInteraction];
    buttonInteractionUnload: [name: String];

    contextInteractionDeploy: [contextInteraction: ContextInteraction];
    contextInteractionLoad: [contextInteraction: ContextInteraction];
    contextInteractionReload: [contextInteraction: ContextInteraction];
    contextInteractionUnload: [name: String];

    modalInteractionLoad: [modalInteraction: ModalInteraction];
    modalInteractionReload: [modalInteraction: ModalInteraction];
    modalInteractionUnload: [name: String];

    selectMenuInteractionLoad: [selectMenuInteraction: SelectMenuInteraction];
    selectMenuInteractionReload: [selectMenuInteraction: SelectMenuInteraction];
    selectMenuInteractionUnload: [name: String];

    slashCommandDeploy: [slashComand: SlashCommand];
    slashCommandLoad: [slashComand: SlashCommand];
    slashCommandReload: [slashComand: SlashCommand];
    slashCommandUnload: [name: String];

}

export interface InteractionManagerOptions {

    guildIDs: Snowflake[];
    locationButtonInteractions: String | null;
    locationContextInteractions: String | null;
    locationModalInteractions: String | null;
    locationSelectMenuInteractions: String | null;
    locationSlashCommands: String | null;

}

export class Logger {

    public constructor(options: LoggerOptions);
    public options: LoggerOptions;
    public webhooks: WebhookClient[];

    private _getTime(date: Date): Date;
    private _log(strings: { consoleString: String, webhookString: String }): void;
    public debug(string: String): Logger;
    public error(string: String): Logger;
    public fail(string: String): Logger;
    public info(string: String): Logger;
    public success(string: String): Logger;
    public warn(string: String): Logger;

}

export interface LoggerIcons {

    debug: String,
    error: String,
    fail: String,
    info: String,
    success: String,
    warn: String

}

export interface LoggerOptions {

    icons: LoggerIcons,
    name: String,
    webhooks: WebhookClient[]

}

export class ModalInteraction extends BaseComponent {

    public constructor(client: Client, manager: ModalInteractionManager, data: ModalInteractionData);
    public client: Client;
    public manager: ModalInteractionManager;
    private data: ModalInteractionData;

    public buildModal(): ModalBuilder | DisGroupDevError;
    public get components(): Array<TextInputBuilder>;
    public load(): Promise<Boolean | DisGroupDevError>;
    public get title(): String;
    public reload(): Promise<Boolean | DisGroupDevError>;
    public unload(): Promise<Boolean | DisGroupDevError>;

}

export interface ModalInteractionData extends BaseComponentData {

    components: TextInputBuilder[];
    title: String;

}

export class ModalInteractionManager {

    public constructor(client: Client, interactionManager: InteractionManager);
    public cache: Collection<String, ModalInteraction>;
    public client: Client;
    public manager: InteractionManager;

    public load(path: String): Promise<Boolean | DisGroupDevError>;
    public loadAll(): Promise<Boolean | DisGroupDevError>;
    public reload(name: String): Promise<Boolean | DisGroupDevError>;
    public reloadAll(): Promise<Boolean | DisGroupDevError>;
    public unload(name: String): Promise<Boolean | DisGroupDevError>;
    public unloadAll(): Promise<Boolean | DisGroupDevError>;

}

export class SelectMenuInteraction extends BaseComponent {

    public constructor(client: Client, manager: SelectMenuInteractionManager, data: SelectMenuInteractionData);
    public client: Client;
    public manager: SelectMenuInteractionManager;
    private data: SelectMenuInteractionData;

    public buildSelectMenu(): SelectMenuBuilder | DisGroupDevError;
    public get disabled(): Boolean;
    public load(): Promise<Boolean | DisGroupDevError>;
    public get maxValues(): Number;
    public get minValues(): Number;
    public get options(): SelectMenuOptionBuilder[];
    public get placeholder(): String;
    public reload(): Promise<Boolean | DisGroupDevError>;
    public unload(): Promise<Boolean | DisGroupDevError>;

}

export interface SelectMenuInteractionData extends BaseComponentData {

    disabled: Boolean;
    maxValues: Number;
    minValues: Number;
    options: SelectMenuOptionBuilder[];
    placeholder: String;

}

export class SelectMenuInteractionManager {

    public constructor(client: Client, interactionManager: InteractionManager);
    public cache: Collection<String, SelectMenuInteraction>;
    public client: Client;
    public manager: InteractionManager;

    public load(path: String): Promise<Boolean | DisGroupDevError>;
    public loadAll(): Promise<Boolean | DisGroupDevError>;
    public reload(name: String): Promise<Boolean | DisGroupDevError>;
    public reloadAll(): Promise<Boolean | DisGroupDevError>;
    public unload(name: String): Promise<Boolean | DisGroupDevError>;
    public unloadAll(): Promise<Boolean | DisGroupDevError>;

}

export class SlashCommand extends BaseInteraction {

    public constructor(client: Client, manager: SlashCommandInteractionManager, data: SlashCommandData);
    public client: Client;
    public manager: SlashCommandInteractionManager;
    private data: SlashCommandData;

    public deploy(): Promise<Boolean | DisGroupDevError>;
    public get description(): String;
    public get descriptionLocalizations(): LocalizationMap;
    public get hidden(): Boolean;
    public load(): Promise<Boolean | DisGroupDevError>;
    public get options(): Array<ApplicationCommandOptionData>;
    public get usage(): String;
    public reload(): Promise<Boolean | DisGroupDevError>;
    public unload(): Promise<Boolean | DisGroupDevError>;

}

export interface SlashCommandData extends BaseInteractionData {

    description: String;
    descriptionLocalizations: LocalizationMap;
    hidden: Boolean;
    options: Array<ApplicationCommandOptionData>;
    type: null;
    usage: String;

}

export class SlashCommandInteractionManager {

    public constructor(client: Client, interactionManager: InteractionManager);
    public cache: Collection<String, SlashCommand>;
    public client: Client;
    public manager: InteractionManager;

    public deploy(slashCommand: SlashCommand): Promise<Boolean | DisGroupDevError>;
    public deployAll(): Promise<Boolean | DisGroupDevError>;
    public load(path: String): Promise<Boolean | DisGroupDevError>;
    public loadAll(): Promise<Boolean | DisGroupDevError>;
    public reload(name: String): Promise<Boolean | DisGroupDevError>;
    public reloadAll(): Promise<Boolean | DisGroupDevError>;
    public unload(name: String): Promise<Boolean | DisGroupDevError>;
    public unloadAll(): Promise<Boolean | DisGroupDevError>;

}

export class StatusPageChecker extends EventEmitter {

    public constructor(options: StatusPageCheckerOptions);
    public incidents: Collection<String, StatusPageCheckerIncidentData>;
    public options: StatusPageCheckerOptions;
    public webhook: WebhookClient;

    private _fetch():  Promise<any>;
    private _generateEmbed(): Promise<EmbedBuilder>;
    private _loadIncidents(): Promise<Boolean | DisGroupDevError>;
    private _loadRawIncidents(): Promise<Array<StatusPageCheckerIncidentData>>;
    private _save(): Boolean;
    public check(): Promise<Boolean | DisGroupDevError>;
    public updateIncident(incident: StatusPageCheckerIncidentDataRaw, messageId: String | null): Promise<Boolean | DisGroupDevError>;

    public on<K extends keyof StatusPageCheckerEvents>(event: K, listener: (...args: StatusPageCheckerEvents[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
        event: Exclude<S, keyof StatusPageCheckerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public once<K extends keyof StatusPageCheckerEvents>(event: K, listener: (...args: StatusPageCheckerEvents[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
        event: Exclude<S, keyof StatusPageCheckerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public emit<K extends keyof StatusPageCheckerEvents>(event: K, ...args: StatusPageCheckerEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof StatusPageCheckerEvents>, ...args: unknown[]): boolean;

    public off<K extends keyof StatusPageCheckerEvents>(event: K, listener: (...args: StatusPageCheckerEvents[K]) => Awaitable<void>): this;
    public off<S extends string | symbol>(
        event: Exclude<S, keyof StatusPageCheckerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public removeAllListeners<K extends keyof StatusPageCheckerEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof StatusPageCheckerEvents>): this;

}

export interface StatusPageCheckerEvents {

    incidentCheck: [];
    incidentCreate: [incident: IncidentData];
    incidentUpdate: [incidentData: IncidentData];

}

export interface StatusPageCheckerOptions {

    checkInterval: Number;
    colors: StatusPageCheckerOptionsColors;
    storage: String;
    url: String;
    webhook: WebhookClient;

}

export interface StatusPageCheckerOptionsColors {

    BLACK: String;
    GREEN: String;
    ORANGE: String;
    RED: String;
    YELLOW: String;

}

export interface StatusPageCheckerIncidentData {

    id: String;
    lastUpdate: String;
    messageId: Snowflake | null;
    resolved: Boolean;

}

export interface StatusPageCheckerIncidentDataRaw {

    components: Array<StatusPageCheckerIncidentDataRawComponent>;
    created_at: String;
    id: String;
    impact: 'none' | 'minor' | 'major' | 'critical';
    incident_updates: Array<StatusPageCheckerIncidentDataRawUpdate>;
    monitoring_at: String | null;
    name: String;
    page_id: String;
    resolved_at: String | null;
    shortlink: String;
    started_at: String;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem';
    updated_at: String | null;

}

export interface StatusPageCheckerIncidentDataRawComponent {

    created_at: String;
    description: String;
    group: Boolean;
    group_id: String | null;
    id: String;
    only_show_if_degraded: Boolean;
    page_id: String;
    position: Number;
    showcase: Boolean;
    start_date: String | null;
    status: String;
    updated_at: String;

}

export interface StatusPageCheckerIncidentDataRawComponentUpdate {

    code: String;
    name: String;
    new_status: String;
    old_status: String;

}

export interface StatusPageCheckerIncidentDataRawUpdate {

    affected_components: Array<StatusPageCheckerIncidentDataRawComponentUpdate>;
    body: String;
    created_at: String;
    custom_tweet: String | null;
    deliver_notifications: Boolean;
    display_at: String;
    id: String;
    incident_id: String;
    status: String;
    tweet_id: String | null;
    update_at: String;

}

export class TextTicket extends BaseTicket {

    public constructor(client: Client, manager: TextTicketManager, data: TicketDataRaw);
    public client: Client;
    public manager: TextTicketManager;
    private data: TicketDataRaw;

    public addMember(member: GuildMemberResolvable): Promise<TextTicket | DisGroupDevError>;
    public close(): Promise<TextTicket | DisGroupDevError>;
    public delete(): Promise<Boolean | DisGroupDevError>;
    public removeMember(member: GuildMemberResolvable): Promise<TextTicket | DisGroupDevError>;
    public rename(name: String): Promise<TextTicket | DisGroupDevError>;
    public reopen(): Promise<TextTicket | DisGroupDevError>;

}

export class TextTicketManager extends BaseTicketManager {

    public constructor(client: Client, options: TextTicketManagerOptions);

    public cache: Collection<Number, TextTicket>;
    public options: TextTicketManagerOptions;

    private _init(): void;
    public closeTicket(ticket: TextTicket): Promise<TextTicket | DisGroupDevError>;
    public createTicket(guild: GuildResolvable, user: UserResolvable): Promise<TextTicket | DisGroupDevError>;
    public deleteTicket(ticket: TextTicket): Promise<Boolean | DisGroupDevError>;
    public renameTicket(ticket: TextTicket, name: String): Promise<TextTicket | DisGroupDevError>;
    public reopenTicket(ticket: TextTicket): Promise<TextTicket | DisGroupDevError>;

    public on<K extends keyof TextTicketManagerEvents>(event: K, listener: (...args: TextTicketManagerEvents[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
        event: Exclude<S, keyof TextTicketManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public once<K extends keyof TextTicketManagerEvents>(event: K, listener: (...args: TextTicketManagerEvents[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
        event: Exclude<S, keyof TextTicketManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public emit<K extends keyof TextTicketManagerEvents>(event: K, ...args: TextTicketManagerEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof TextTicketManagerEvents>, ...args: unknown[]): boolean;

    public off<K extends keyof TextTicketManagerEvents>(event: K, listener: (...args: TextTicketManagerEvents[K]) => Awaitable<void>): this;
    public off<S extends string | symbol>(
        event: Exclude<S, keyof TextTicketManagerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public removeAllListeners<K extends keyof TextTicketManagerEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof TextTicketManagerEvents>): this;

}

export interface TextTicketManagerEvents {

    ticketClose: [ticket: TextTicket];
    ticketCreate: [ticket: TextTicket];
    ticketDelete: [ticket: TextTicket];
    ticketRename: [ticket: TextTicket];
    ticketReopen: [ticket: TextTicket];

}

export interface TextTicketManagerOptions extends BaseTicketManagerOptions {

    channelTopic: String;
    closedParentId: Snowflake | null;
    parentId: Snowflake;

}

export interface TicketDataRaw {

    channelId: Snowflake;
    guildId: Snowflake;
    participants: Array<Snowflake>;
    status: TicketDataStatus;
    type: TicketDataType;
    userId: Snowflaek;

}

export type TicketDataStatus = 'CLOSED' | 'DELETED' | 'OPEN';

export type TicketDataType = 'CHANNEL';

export class TranslationManager {

    public constructor(options: TranslationMangerOptions);
    private _namespaces: Array | null;
    private _translations: Map<String, Function> | null;
    public options: TranslationMangerOptions;
    public isReady: Boolean;

    private _init(): void;
    private _loadAll(options: { folderName: String, namespaces: Array, translationDir: String }): Promise<Object<Array<Set>, Array>>;
    public delete(name: String): Map<String, Function> | DisGroupDevError | null;
    public get(name: String): Function | null | DisGroupDevError;
    public has(name: String): Boolean | DisGroupDevError;
    public list(): Array<Function>;
    public set(name: String, value: Function): Map<String, Function> | DisGroupDevError;
    public size(): Number;
    public translate(key: String, args: Object, options: { language: String }): String | DisGroupDevError | null;

}

export interface TranslationMangerOptions {

    defaultLanguage: String;
    i18nextOptions: InitOptions;
    locationTranslations: String;

}

export class Utilities {

    public constructor();
    public REGEXES: Object;
    public generateProgressBar(current: Number, all: Number, options: { current: String, length: Number, line: String }): String;
    public getReadableTime(date: Date): String;

}

export type Awaitable<T> = T | PromiseLike<T>;
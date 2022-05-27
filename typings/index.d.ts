import {
    ApplicationCommandOptionData,
    ApplicationCommandType,
    Client,
    Collection, MessageEmbed,
    PermissionString,
    Snowflake,
    TextBasedChannelTypes,
    WebhookClient
} from 'discord.js';
import { LocalizationMap } from 'discord-api-types/v10';
import { EventEmitter } from 'node:events';
import { InitOptions } from 'i18next';

export class BaseComponent {

    public constructor(client: Client, data: BaseComponentData);
    public client: Client;
    public cooldowns: Map<Snowflake, Boolean>;
    public data: BaseComponentData;

    public get betaOnly(): Boolean;
    public get category(): String;
    public get channelOnly(): Array<TextBasedChannelTypes>;
    public get clientPermissions(): Array<PermissionString>;
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
    public get userPermissions(): Array<PermissionString>;
    public toJSON(): BaseComponentData;

}

export interface BaseComponentData {

    name: String;
    enabled: Boolean;
    clientPermissions: Array<PermissionString>;
    userPermissions: Array<PermissionString>;
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
    public data: BaseInteractionData;

    public get betaOnly(): Boolean;
    public get category(): String;
    public get channelOnly(): Array<TextBasedChannelTypes>;
    public get clientPermissions(): Array<PermissionString>;
    public get cooldown(): Number;
    public get defer(): Boolean;
    public get devOnly(): Boolean;
    public get dirname(): String;
    public get enabled(): Boolean;
    public get ephemeral(): Boolean;
    public get experiment(): ExperimentData;
    public get guildOnly(): Boolean;
    // @ts-ignore
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
    public get userPermissions(): Array<PermissionString>;
    public toJSON(): BaseInteractionData;

}

export interface BaseInteractionData {

    name: String;
    nameLocalizations: LocalizationMap;
    enabled: Boolean;
    clientPermissions: Array<PermissionString>;
    userPermissions: Array<PermissionString>;
    category: String;
    cooldown: Number;
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

export class ContextInteraction extends BaseInteraction {

    public constructor(client: Client, manager: ContextInteractionManager, data: ContextInteractionData);
    public client: Client;
    public manager: ContextInteractionManager;
    public data: ContextInteractionData;

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
    public data: EventData;

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

export class InteractionManager extends EventEmitter {

    public constructor(client: Client, options: InteractionManagerOptions);
    public client: Client;
    public options: InteractionManagerOptions;
    public slash: SlashCommandInteractionManager | null;

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

    slashCommandDeploy: [slashComand: SlashCommand],
    slashCommandLoad: [slashComand: SlashCommand],
    slashCommandReload: [slashComand: SlashCommand],
    slashCommandUnload: [name: String],

}

export interface InteractionManagerOptions {

    guildIDs: Snowflake[],
    locationSlashCommands: String | null;

}

export class SlashCommand extends BaseInteraction {

    public constructor(client: Client, manager: SlashCommandInteractionManager, data: SlashCommandData);
    public client: Client;
    public manager: SlashCommandInteractionManager;
    public data: SlashCommandData;

    public get defaultEnabled(): Boolean;
    public deploy(): Promise<Boolean | DisGroupDevError>;
    public get deployEnabled(): Boolean;
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

    defaultEnabled: Boolean;
    deployEnabled: Boolean;
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
    private _generateEmbed(): Promise<MessageEmbed>;
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
    incident_updates: Array<StatusPageCheckerIncidentDataRawIncidentUpdate>;
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
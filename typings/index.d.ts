import {ApplicationCommandType, Client, PermissionString, Snowflake, TextBasedChannelTypes, Webhook} from 'discord.js';
import {LocalizationMap} from 'discord-api-types/v10';
import { EventEmitter } from 'node:events';

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

export class DisGroupDevError extends Error {}

export interface ExperimentData {

    required: Boolean;
    id: Number | null;

}

export class Logger {

    public constructor(options: LoggerOptions);
    public options: LoggerOptions;
    public webhooks: Webhook[];

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
    webhooks: Webhook[]

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

export class SlashCommand {



}

export class SlashCommandInteractionManager {



}

export class Utilities {

    public constructor();
    public REGEXES: Object;
    public generateProgressBar(current: Number, all: Number, options: { current: String, length: Number, line: String }): String;
    public getReadableTime(date: Date): String;

}

export type Awaitable<T> = T | PromiseLike<T>;
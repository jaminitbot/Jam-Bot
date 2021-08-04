import {Client, Collection, PermissionString} from "discord.js"
import {Logger} from "winston";
import {slashCommandOptions} from "./commands/general/poll";

type permission = PermissionString | 'OWNER'

export interface CollectionCommand {
	// eslint-disable-next-line @typescript-eslint/ban-types
	executeSlash: Function;
	// eslint-disable-next-line @typescript-eslint/ban-types
	executeButton: Function;
	slashCommandOptions: Any;
	exposeSlash: boolean;
    allowInDm: boolean;
    aliases: Array<string>;
	name: string,
	description: string,
	permissions: Array<permission>
	usage: string
	// eslint-disable-next-line @typescript-eslint/ban-types
	execute: Function

}

export interface client extends Client {
    logger: Logger;
	commands: Collection<string, CollectionCommand>
}
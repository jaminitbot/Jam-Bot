import {Client, Collection, PermissionString} from "discord.js"
import {Logger} from "winston";

type permission = PermissionString | 'OWNER'

export interface CollectionCommand {
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
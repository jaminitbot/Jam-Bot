import {Client, Collection, PermissionString} from "discord.js"
import {Logger} from "winston";

export interface CollectionCommand {
	name: string,
	description: string,
	permissions: Array<PermissionString>
	usage: string
	// eslint-disable-next-line @typescript-eslint/ban-types
	execute: Function

}

export interface client extends Client {
    logger: Logger;
	commands: Collection<string, CollectionCommand>
}
import {Client, Collection, PermissionString} from "discord.js"
import * as winston from "winston";

export interface CollectionCommand {
	name: string,
	description: string,
	permissions: Array<PermissionString>
	usage: string
	// eslint-disable-next-line @typescript-eslint/ban-types
	execute: Function

}

export interface client extends Client {
    logger: winston.Logger;
	commands: Collection<unknown, CollectionCommand>
}
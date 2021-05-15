import { Client, Collection, PermissionString } from "discord.js"
export interface Command {
	name: String,
	description: String,
	permissions: Array<PermissionString>
	usage: String
}
export interface client extends Client {
	commands: Collection<Object, Command>
}
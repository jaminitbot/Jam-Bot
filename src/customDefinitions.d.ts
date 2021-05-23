import { Client, Collection, PermissionString } from "discord.js"

export interface CollectionCommand {
	name: String,
	description: String,
	permissions: Array<PermissionString>
	usage: String
	execute: Function

}
export interface client extends Client {
	commands: Collection<Object, CollectionCommand>
}
import { ButtonInteraction, Client, Collection, CommandInteraction, Message, PermissionString, SelectMenuInteraction } from "discord.js"
import { Logger } from "winston";
import { SlashCommandBuilder } from '@discordjs/builders'

type Permission = PermissionString | 'OWNER'
export type Permissions = Array<Permission>
export interface Command {
	executeSelectMenu: (client: BotClient, interaction: SelectMenuInteraction) => Promise<void>
	executeSlash: (client: BotClient, interaction: CommandInteraction) => Promise<void>
	executeButton: (client: BotClient, interaction: ButtonInteraction) => Promise<void>
	slashData: SlashCommandBuilder
	allowInDm: boolean
	aliases: Array<string>
	name: string
	description: string
	permissions: Array<Permission>
	usage: string
	execute: (client: BotClient, message: Message, args: Array<unknown>) => Promise<void>
}
interface Event {
	name: string
	// eslint-disable-next-line @typescript-eslint/ban-types
	register: Function
}
export interface BotClient extends Client {
	events: Collection<string, Event>
	logger: Logger
	commands: Collection<string, Command>
}
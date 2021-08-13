import { ButtonInteraction, Client, Collection, CommandInteraction, Message, PermissionString } from "discord.js"
import { Logger } from "winston";
import { SlashCommandBuilder } from '@discordjs/builders'
type permission = PermissionString | 'OWNER'

export interface Command {
	executeSlash: (client: BotClient, interaction: CommandInteraction) => void
	executeButton: (client: BotClient, interaction: ButtonInteraction) => void
	slashData: SlashCommandBuilder
	allowInDm: boolean
	aliases: Array<string>
	name: string
	description: string,
	permissions: Array<permission>
	usage: string
	execute: (client: BotClient, message: Message, args: Array<unknown>) => void

}

export interface BotClient extends Client {
	logger: Logger
	commands: Collection<string, Command>
}
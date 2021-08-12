import { ButtonInteraction, Client, Collection, CommandInteraction, Message, PermissionString } from "discord.js"
import { Logger } from "winston";
import { SlashCommandBuilder } from '@discordjs/builders'
type permission = PermissionString | 'OWNER'

export interface CollectionCommand {
	executeSlash: (client: client, interaction: CommandInteraction) => void
	executeButton: (client: client, interaction: ButtonInteraction) => void
	slashData: SlashCommandBuilder;
	exposeSlash: boolean;
	allowInDm: boolean;
	aliases: Array<string>;
	name: string,
	description: string,
	permissions: Array<permission>
	usage: string
	execute: (client: client, message: Message, args: Array<unknown>) => void

}

export interface client extends Client {
	logger: Logger;
	commands: Collection<string, CollectionCommand>
}
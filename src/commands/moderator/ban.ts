import { Message } from "discord.js"
import KickOrBan from '../../functions/kickorban'
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'ban'
export const description = 'Bans a user from the server'
export const permissions = ['BAN_MEMBERS']
export const usage = 'ban @user'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user to ban')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('(Optional) reason to ban the user')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args) {
	KickOrBan(message, args, 'ban')
}

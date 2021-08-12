import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import kickOrBan from '../../functions/kickorban'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'kick'
export const description = 'Kicks a user from the server'
export const permissions = ['KICK_MEMBERS']
export const usage = 'kick @user'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user to kick')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('(Optional) reason to kick the user')
			.setRequired(false))
export async function execute(client: client, message: Message, args) {
	kickOrBan(message, args, 'kick')
}

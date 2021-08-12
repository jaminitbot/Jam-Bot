import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'invite'
export const description = 'Generates an invite URL for the current channel'
export const usage = 'invite'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
export async function execute(client: client, message: Message, args) {
	if (message.channel.type == 'GUILD_TEXT' || message.channel.type == 'GUILD_NEWS') {
		const invite = await message.channel.createInvite({ maxAge: 0 })
		message.reply('Invite link: ' + invite.url)
	}
}

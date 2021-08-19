import { Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getErrorMessage } from '../../functions/messages'

export const name = 'invite'
export const description = 'Generates an invite URL for the current channel'
export const usage = 'invite'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)

export async function execute(client: BotClient, message: Message, args) {
	if (message.channel.type == 'GUILD_TEXT' || message.channel.type == 'GUILD_NEWS') {
		let invite
		try {
			invite = await message.channel.createInvite({ maxAge: 0 })
		} catch (error) {
			if (!message.guild.me.permissions.has('CREATE_INSTANT_INVITE')) {
				message.channel.send('Hey! I couldn\'t create that invite due to lack of permissions, ask an admin to check my permissions!')
			} else {
				message.channel.send(getErrorMessage())
			}
			return
		}

		message.reply('Invite link: ' + invite.url)
	}
}

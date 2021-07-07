import { Message } from "discord.js"
import { client } from '../customDefinitions'

export const name = 'invite'
export const description = 'Generates an invite URL for the current channel'
export const usage = 'invite'
export async function execute(client: client, message: Message, args) {
	if (message.channel.type == 'news' || message.channel.type == 'text') {
		const invite = await message.channel.createInvite({ maxAge: 0 })
		message.reply('Invite link: ' + invite.url)
	}
}

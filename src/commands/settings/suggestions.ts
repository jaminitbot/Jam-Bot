import { Message, TextChannel } from "discord.js"
import { Logger } from "winston"
import { client } from '../../customDefinitions'
import { setKey } from '../../functions/db'

export const name = 'suggestions'
export const description = 'Sets the channel for suggestions'
export const usage = 'settings suggestions #suggestions'
export async function execute(client: client, message: Message, args, logger: Logger) {

	const channelInput = args[1].slice(2, -1)
	if (!channelInput)
		return message.channel.send(
			'You need to specify a channel!\n' + this.usage
		)
	// @ts-expect-error
	const channel: TextChannel = await message.guild.channels.fetch(channelInput)
	if (!(channel.type == 'text' || channel.type == 'news')) return
	if (!channel) return message.channel.send('Not a valid channel!')
	setKey(message.guild.id, 'suggestionChannel', channel.id)
	message.channel.send('Set suggestion channel!')
	channel.send('Suggestions will be sent here!')
}

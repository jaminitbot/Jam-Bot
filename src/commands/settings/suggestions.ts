import { Message, TextChannel } from "discord.js"
import { Logger } from "winston"
import { client } from '../../custom'
import { setKey } from '../../functions/db'

export let name = 'suggestions'
export let description = 'Sets the channel for suggestions'
export let usage = 'settings suggestions #suggestions'
export function execute(client: client, message: Message, args, logger: Logger) {

	const channelInput = args[1].slice(2, -1)
	if (!channelInput)
		return message.channel.send(
			'You need to specify a channel!\n' + this.usage
		)
	// @ts-expect-error
	const channel: TextChannel = message.guild.channels.cache.get(channelInput)
	if (!(channel.type == 'text' || channel.type == 'news')) return
	if (!channel) return message.channel.send('Not a valid channel!')
	setKey(message.guild.id, 'suggestionChannel', channel.id)
	message.channel.send('Set suggestion channel!')
	channel.send('Suggestions will be sent here!')
}

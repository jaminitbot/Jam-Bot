import {Message, TextChannel} from "discord.js"
import {Logger} from "winston"
import {client} from '../../customDefinitions'
import {setKey} from '../../functions/db'
import {getChannelFromString} from '../../functions/util'
export const name = 'suggestions'
export const description = 'Sets the channel for suggestions'
export const usage = 'settings suggestions #suggestions'
export async function execute(client: client, message: Message, args, logger: Logger) {
	//@ts-expect-error
	const channel:TextChannel = await getChannelFromString(message.guild, args[0])
	if (!channel)
		return message.channel.send(
			'You need to specify a channel!\n' + this.usage
		)
	if (!(channel.type == 'text' || channel.type == 'news')) return
	if (!channel) return message.channel.send('Not a valid channel!')
	await setKey(message.guild.id, 'suggestionChannel', channel.id)
	await message.channel.send('Set suggestion channel!')
	channel.send('Suggestions will be sent here!')
}

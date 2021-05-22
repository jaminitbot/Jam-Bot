import { Message, TextChannel } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"

export const name = 'say'
export const description = 'Say'
export const usage = 'say #general Hiiii'
export function execute(client: client, message: Message, args, logger: Logger) {
	if (message.author.id !== process.env.OWNERID) return
	message.delete()
	// @ts-expect-error
	const channel: TextChannel =
		message.mentions.channels.first() ||
		client.channels.cache.get(args[0])
	if (!channel)
		return message.reply('you need to specify a valid channel')
	if (!(channel.type == 'text' || channel.type == 'news')) return
	const thingToSay = args.splice(1).join(' ')
	channel.send(thingToSay)
}

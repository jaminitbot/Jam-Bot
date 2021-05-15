import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
const guildEvent = require('../events/guildCreate')

export const name = 'guild'
export const description = 'Gets guild info'
export const usage = ''
export function execute(client: client, message: Message, args, logger: Logger) {

	if (message.author.id == process.env.OWNERID) {
		if (!args[0]) return message.reply('you need to specify a guild id')
		message.channel.send({
			embed: guildEvent.generateGuildInfoEmbed(
				client.guilds.cache.get(args[0])
			),
		})
	}
}

import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"

export const name = 'uptime'
export const description = "Displays the bot's current uptime"
export const usage = 'uptime'
export function execute(client: client, message: Message, args, db, logger: Logger) {
	let TimeDate = new Date(Date.now() - client.uptime)
	message.channel.send(
		'The bot has been up since: ' + TimeDate.toString()
	)
}

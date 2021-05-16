// Don't ask why this is a thing, waffle wanted it
import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"

export const name = 'cactus'
export const description = 'Ouch'
export const usage = 'cactus'
export function execute(client: client, message: Message, args, logger: Logger) {

	message.channel.send(
		'https://cdn.discordapp.com/attachments/797536333064044595/804088627910148136/download_2.jpeg'
	)
}

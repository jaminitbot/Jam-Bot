// Don't ask why this is a thing, waffle wanted it
import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"

export let name = 'cactus'
export let description = 'Ouch'
export let usage = 'cactus'
export function execute(client: client, message: Message, args, logger: Logger) {

	message.channel.send(
		'https://cdn.discordapp.com/attachments/797536333064044595/804088627910148136/download_2.jpeg'
	)
}

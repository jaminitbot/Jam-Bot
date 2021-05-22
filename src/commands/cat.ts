import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
import fetch from 'node-fetch'

export const name = 'cat'
export const description = 'Purrrr'
export const usage = 'cat'
export async function execute(client: client, message: Message, args, logger: Logger) {
	const { file } = await fetch(
		'https://aws.random.cat/meow'
	).then((response) => response.json())
	message.channel.send(
		file || "Unable to get a kitty cat, the api's probably down"
	)
}

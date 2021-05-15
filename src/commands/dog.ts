import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
import fetch from 'node-fetch'

export const name = 'dog'
export const description = 'Gets a random dog picture, or a specific breed'
export const usage = 'dog'
export async function execute(client: client, message: Message, args, logger: Logger) {

	let data
	if (args[0]) {
		if (args[1]) {
			// Wants to get breed and sub breed
			data = await fetch(
				`https://dog.ceo/api/breed/${args[1]}/${args[0]}/images/random`
			).then((response) => response.json())
		} else {
			// Just breed
			data = await fetch(
				`https://dog.ceo/api/breed/${args[0]}/images/random`
			).then((response) => response.json())
		}
	} else {
		// Just random dog
		data = await fetch(
			'https://dog.ceo/api/breeds/image/random'
		).then((response) => response.json())
	}
	message.channel.send(
		data.message || "Unable to get a doggy, the api's probably down"
	)
}

import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'

export const name = 'koala'
export const description = 'Koala'
export const usage = 'koala'
export async function execute(client: client, message: Message, args) {
	const { link } = await fetch(
		'https://some-random-api.ml/img/koala'
	).then((response) => response.json())
	message.channel.send(
		link || "Unable to get a koala, the api's probably down"
	)
}

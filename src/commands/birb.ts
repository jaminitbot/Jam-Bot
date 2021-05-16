import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
import fetch from 'node-fetch'

export const name = 'birb'
export const description = 'Churp'
export const usage = 'birb'
export async function execute(client: client, message: Message, args, logger: Logger) {

	const { link } = await fetch(
		'https://some-random-api.ml/img/birb'
	).then((response) => response.json())
	message.channel.send(
		link || "Unable to get a birb, the api's probably down"
	)
}

import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
import fetch from 'node-fetch'

export const name = 'birb'
export const description = 'Chirp'
export const usage = 'birb'
export async function execute(client: client, message: Message, args) {
	const { link } = await fetch(
		'https://some-random-api.ml/img/birb'
	).then((response) => response.json())
	message.channel.send(
		link || "Unable to get a birb, the api's probably down"
	)
}

import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"

import fetch from 'node-fetch'

export const name = 'hug'
export const description = 'HUGGSS'
export const usage = 'hug'
export async function execute(client: client, message: Message, args, db, logger: Logger) {
	const { link } = await fetch(
		'https://some-random-api.ml/animu/hug'
	).then((response) => response.json())
	message.channel.send(link)
}

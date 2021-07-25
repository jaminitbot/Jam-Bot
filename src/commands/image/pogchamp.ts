import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'

export const name = 'pogchamp'
export const description = "Gets twitch's pogchamp of the day"
export const usage = 'PogChamp'
export const aliases = ['poggers']
export const allowInDm = true
export async function execute(client: client, message: Message, args) {
	const { img } = await fetch(
		'https://raw.githubusercontent.com/MattIPv4/pogchamp/master/build/data.json'
	).then((response) => response.json())
	message.channel.send(img.medium)
}

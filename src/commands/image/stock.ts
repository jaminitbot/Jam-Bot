import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'
import { randomInt } from '../../functions/util'

export const name = 'stock'
export const description = 'Gets a stock image'
export const usage = 'stock nature'
export const slashCommandOptions = [{
	name: 'search',
	type: 'STRING',
	description: 'The text to search for',
	required: true
}]
export async function execute(client: client, message: Message, args) {
	if (!process.env.pexelsApiKey) return
	if (!args[0])
		return message.reply('You need to specify what to search for!')
	const sent = await message.channel.send(':mag_right: Finding image...')
	const search = args.join(' ')
	const response = await fetch(
		`https://api.pexels.com/v1/search?query=${search}&per_page=100`,
		{
			headers: {
				Authorization: process.env.pexelsApiKey,
			},
		}
	)
	const json = await response.json()
	const image = json.photos[randomInt(0, json.photos.length - 1)].src.medium // eslint-disable-line no-undef
	sent.edit(image || 'Unable to get a stock photo, the api\'s probably down')
}

import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'
import { randomInt } from '../../functions/util'

export const name = 'stockvideo'
export const description = 'Gets a stock video'
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
	const sent = await message.channel.send(':mag_right: Finding video...')
	const search = args.join(' ')
	const response = await fetch(
		`https://api.pexels.com/videos/search?query=${search}&per_page=80`,
		{
			headers: {
				Authorization: process.env.pexelsApiKey,
			},
		}
	)
	const json = await response.json()
	const video = json.videos[Math.floor(randomInt(0, json.videos.length - 1))].video_files[0].link // eslint-disable-line no-undef
	sent.edit(video || 'Unable to get a stock video, the api\'s probably down')
}

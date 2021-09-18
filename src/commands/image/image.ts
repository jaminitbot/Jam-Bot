import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import isImageUrl = require('is-image-url')
import isNumber = require('is-number')
import { SlashCommandBuilder } from '@discordjs/builders'
import { request } from 'undici'
import { Logger } from "winston"

const apiHost = 'https://api.bing.microsoft.com/v7.0/images/search'
const subscriptionKey = process.env.bingImageSearchKey

export const name = 'image'
export const description = 'Searches the web for an image'
export const usage = 'image duck'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('search')
			.setDescription('The text to search for')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('position')
			.setDescription('The specific position to get')
			.setRequired(false))
export async function searchForImage(search: string, position: number, nsfw: boolean, imageType: string, logger: Logger): Promise<string> {
	if (position && position < 1) {
		return 'You cannot get an image for a position less than one!'
	}
	let safeSearchType = 'Off'
	if (!nsfw) { // Non-nsfw channels can't bypass safe search
		safeSearchType = 'Strict'
	}
	const validImageUrls = []
	const response = await request(apiHost + '?safeSearch=' + safeSearchType + '&q=' + encodeURIComponent(search), {
		method: 'GET',
		headers: {
			'Ocp-Apim-Subscription-Key': subscriptionKey
		}
	})
	if (response.statusCode != 200) {
		logger.warn('image: Bing image search is returning non-standard status codes')
		return 'The API is returning errors, please try again later.'
	}
	const responseData = (await response.body.json()).value
	for (const result of responseData) {
		if (isImageUrl(result.contentUrl)) {
			validImageUrls.push(result.contentUrl)
		}
		if (!position && validImageUrls.length) {
			break
		} else if (position <= validImageUrls.length) {
			break
		}
	}
	if (position) {
		// Get specific image at position
		return validImageUrls[position - 1] || `There isn't an ${imageType} for position: ${position}`
	} else {
		return validImageUrls[0] || `No ${imageType} found for your search.`
	}
}
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0]) return message.reply('you need to specify what to search for!')
	let splitBy = 0
	let position
	if (isNumber(args[0])) {
		// User wants to get a specific result
		if (args[0] < 1) {
			return message.reply(
				"you can't get a position less than one silly!"
			)
		}
		splitBy = 1 // Make sure we don't include the position in the search
		position = args[0]
	}
	const sentMessage = await message.channel.send(`:mag_right: Finding image...`)
	const search = args.splice(splitBy).join(' ')
	// @ts-expect-error
	const isNsfw = message.channel.nsfw
	const imageUrl = await searchForImage(search, position, isNsfw, 'image', client.logger)
	sentMessage.edit(imageUrl)
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	const search = interaction.options.getString('search')
	const position = interaction.options.getInteger('position')
	// @ts-expect-error
	const isNsfw = interaction.channel.nsfw
	const imageUrl = await searchForImage(search, position, isNsfw, 'image', client.logger)
	interaction.editReply({ content: imageUrl })
}

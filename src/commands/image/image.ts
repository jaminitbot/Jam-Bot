import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import gis = require('g-i-s');
import isImage = require('is-image');
import isNumber = require('is-number');
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'image'
export const description = 'Searches google for an image'
export const usage = 'image duck'
export const aliases = ['gis'] // GoogleImageSearch
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
export async function searchForImage(search, position, nsfw, imageType): Promise<string> {
	return new Promise(function (resolve, reject) {
		if (!position) position = 1
		if (position < 1) {
			resolve('You cannot get an image for a position less than one!')
		}
		// eslint-disable-next-line prefer-const
		let searchOptions = {
			searchTerm: search
		}
		// @ts-ignore
		if (!nsfw) {
			// Nsfw channels can bypass safe search
			// @ts-expect-error
			searchOptions.queryStringAddition = '&safe=active' // Enable safe search, better than nothing, filters most things
		}
		const validImageUrls = []
		gis(searchOptions, function (error, results) {
			results.forEach((element) => {
				if (isImage(element.url)) {
					validImageUrls.push(element.url)
				}
			})
			if (position) {
				// Get specific image at position
				resolve(validImageUrls[position - 1] || `There isn't an ${imageType} for position: ${position}`)
			} else {
				resolve(validImageUrls[0] || `No ${imageType} found for your search.`)
			}
		})
	});
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
	let imageType: string
	//#region Janky Gif Code
	if (args[args.length - 1] == 'gif') {
		// Gif commands also uses google image search, update wording accordingly
		imageType = 'gif'
	} else {
		imageType = 'image'
	}
	//#endregion
	const sentMessage = await message.channel.send(`:mag_right: Finding image...`)
	const search = args.splice(splitBy).join(' ')
	// @ts-expect-error
	const isNsfw = message.channel.nsfw
	const imageUrl = await searchForImage(search, position, isNsfw, imageType)
	sentMessage.edit(imageUrl)
}
export async function executeSlash(client, interaction: CommandInteraction) {
	await interaction.deferReply()
	const search = interaction.options.getString('search')
	const position = interaction.options.getInteger('position')
	// @ts-expect-error
	const isNsfw = interaction.channel.nsfw
	const imageUrl = await searchForImage(search, position, isNsfw, 'image')
	interaction.editReply({ content: imageUrl })
}

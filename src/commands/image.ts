import { Message } from "discord.js"
import { client } from '../customDefinitions'
import gis = require('g-i-s');
import isImage = require('is-image');
import isNumber = require('is-number');

export const name = 'image'
export const description = 'Searches google for an image'
export const usage = 'image duck'
export const aliases = ['gis'] // GoogleImageSearch
export async function execute(client: client, message: Message, args) {
	if (!args[0])
		return message.reply('you need to specify what to search for!')
	let splitBy = 0
	if (isNumber(args[0])) {
		// User wants to get a specific result
		if (args[0] < 1) {
			return message.reply(
				"you can't get a position less than one silly!"
			)
		}
		splitBy = 1 // Make sure we don't include the position in the search
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
	const searchOptions = {}
	// @ts-ignore
	if (!message.channel.nsfw) {
		// Nsfw channels can bypass safe search
		// @ts-expect-error
		searchOptions.queryStringAddition = '&safe=active' // Enable safe search, better than nothing, filters most things
	}
	const sentMessage = await message.channel.send(`:mag_right: Finding ${imageType}...`)
	// @ts-expect-error
	searchOptions.searchTerm = args.splice(splitBy).join(' ')
	const validImageUrls = []
	gis(searchOptions, function (error, results) {
		if (error)
			return sentMessage.edit(
				'An error occurred while getting your results :c'
			)
		results.forEach((element) => {
			if (isImage(element.url)) {
				validImageUrls.push(element.url)
			}
		})
		if (splitBy == 1) {
			// Get specific image at position
			sentMessage.edit(
				validImageUrls[args[0] - 1] ||
				`There isn't an ${imageType} for position: ` + args[0]
			)
		} else {
			sentMessage.edit(
				validImageUrls[0] || `No ${imageType} found for your search.`
			)
		}
	})
}

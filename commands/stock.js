const config = require('../config.json')
const random = require('random')
const fetch = require('node-fetch')
module.exports = {
	name: 'stock',
	description: 'Gets a stock image',
	usage: 'stock nature',
	async execute(client, message, args, db, logger) {
		if (!config.settings.pexelsApiKey) return
		if (!args[0]) return message.reply('You need to specify what to search for!')
		const sent = await message.channel.send(':mag_right: Finding image...')
		const search = args.join(' ')
		const response = await fetch(`https://api.pexels.com/v1/search?query=${search}&per_page=100`, {
			headers: {
				Authorization: config.settings.pexelsApiKey
			}
		})
		const json = await response.json()
		const image = json.photos[random.int(min = 0, max = json.photos.length - 1)].src.medium // eslint-disable-line no-undef
		sent.edit(image || 'Unable to get a stock photo, the api\'s probably down')
	}
}

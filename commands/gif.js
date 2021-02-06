const config = require('../config.json')
const random = require('random')
const fetch = require('node-fetch')
module.exports = {
	name: 'gif',
	description: 'Gets a gif from gify',
	usage: 'gif dog',
	async execute(client, message, args, db) {
		if (!config.settings.gifyApiKey) return
		if (!args[0]) return message.reply('You need to specify what to search for!\nGif search powered by [Giphy](giphy.com).')
		const sent = await message.channel.send(':mag_right: Finding gif...')
		const search = args.join(' ')
		const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${config.settings.gifyApiKey}&q=${search}&rating=pg-13`, {})
		const json = await response.json()
		const image = json.data[random.int(min = 0, max = json.data.length - 1)].images.original.url
		sent.edit(image || 'Unable to get a stock photo, the api\'s probably down')
	}
}

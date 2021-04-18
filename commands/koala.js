const fetch = require('node-fetch')
module.exports = {
	name: 'koala',
	description: 'Koala',
	usage: 'koala',
	async execute(client, message, args, db, logger) {
		const { link } = await fetch('https://some-random-api.ml/img/koala').then(response => response.json())
		message.channel.send(link || 'Unable to get a koala, the api\'s probably down')
	}
}

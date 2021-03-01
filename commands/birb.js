const fetch = require('node-fetch')
module.exports = {
	name: 'birb',
	description: 'Churp',
	usage: 'birb',
	async execute(client, message, args, db, logger) {
		const { link } = await fetch('https://some-random-api.ml/img/birb').then(response => response.json())
		message.channel.send(link || 'Unable to get a birb, the api\'s probably down')
	}
}

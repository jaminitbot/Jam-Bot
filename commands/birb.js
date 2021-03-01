const fetch = require('node-fetch')
module.exports = {
	name: 'birb',
	description: 'Churp',
	usage: 'birb',
	async execute(client, message, args, db, logger) {
		const { link } = await fetch('https://some-random-api.ml/img/birb').then(response => response.json())
		const { fact } = await fetch('https://some-random-api.ml/facts/bird').then(response => response.json())
		if (fact){
			message.channel.send(fact)
		}
		message.channel.send(link || 'Unable to get a birb, the api\'s probably down')
	}
}

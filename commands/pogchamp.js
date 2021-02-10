const fetch = require('node-fetch')
module.exports = {
	name: 'pogchamp',
	description: 'Gets twitch\'s pogchamp of the day',
	usage: 'PogChamp',
	async execute(client, message, args, db, logger) {
		const data = await fetch('https://raw.githubusercontent.com/MattIPv4/pogchamp/master/build/data.json').then(response => response.json())
		message.channel.send(data.img.medium)
	},
}
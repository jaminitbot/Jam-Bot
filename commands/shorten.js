const fetch = require('node-fetch')
module.exports = {
	name: 'shorten',
	description: 'Shortens a url',
	usage: 'shorten https://google.com',
	async execute(client, message, args, db) {
        if (!args[0]) return message.channel.send('You need to specify a url')
        const data = await fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(args[0])).then(response => response.json())
        message.channel.send(data.shorturl || 'Error getting short url')
	},
};
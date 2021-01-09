const fetch = require('node-fetch')
module.exports = {
	name: 'fox',
	description: 'FOX',
	usage: 'fox',
	async execute(client, message, args, db) {
        const { image } = await fetch('https://randomfox.ca/floof/').then(response => response.json());
        message.channel.send(image || 'Unable to get a cute fox, the api\'s probably down')
	},
};
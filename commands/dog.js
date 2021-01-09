const fetch = require('node-fetch')
module.exports = {
	name: 'dog',
	description: 'Woof',
	usage: 'dog',
	async execute(client, message, args, db) {
        const data = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
        message.channel.send(data.message);
	},
};
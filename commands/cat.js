const fetch = require('node-fetch')
module.exports = {
	name: 'cat',
	description: 'Purrrr',
	usage: 'cat',
	execute(client, message, args, db) {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        message.channel.send(file);
	},
};
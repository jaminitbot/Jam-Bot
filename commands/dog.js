const fetch = require('node-fetch')
module.exports = {
	name: 'dog',
	description: 'Woof',
	usage: 'dog',
	async execute(client, message, args, db) {
		if (args[0]){
			var data = await fetch(`https://dog.ceo/api/breed/${args.join(' ')}/images/random`).then(response => response.json());
		} else {
			var data = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json())
		}
        message.channel.send(data.message || 'Unable to get a doggy, the api\'s probably down')
	},
};
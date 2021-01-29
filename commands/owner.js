const config = require('../config.json')
module.exports = {
	name: 'owner',
	description: 'Displays the owner of the bot',
	usage: 'owner',
	async execute(client, message, args, db) {
		message.react('🇯')
			.then(() => (message.react('🇦')))
			.then(() => (message.react('🇲')))
			.then(() => (message.react('🇪')))
			.then(() => (message.react('🇸')))
	}
}

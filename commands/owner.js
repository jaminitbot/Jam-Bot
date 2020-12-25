const config = require('../config.json')
module.exports = {
	name: 'owner',
	description: 'Displays the owner of the bot',
	usage: 'owner',
	execute(client, message, args, db) {
        message.reply(`The owner of the bot is: ${config.settings.ownername}`)
	},
};
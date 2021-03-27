const config = require('../config.json')
module.exports = {
	name: 'owner',
	description: 'Displays the owner of the bot',
	usage: 'owner',
	async execute(client, message, args, db, logger) {
		message.channel.send('jamesatjaminit#6406')
	}
}

const { MessageReaction } = require('discord.js')
const config = require('../config.json')
const messages = require('../functions/messages')
module.exports = {
	name: 'shutdown',
	description: 'STOPS THE BOT',
	usage: 'shutdown',
	async execute(client, message, args, db) {
		if (config.settings.ownerid == message.author.id) {
			await message.channel.send('Shutting Down...')
			await client.destroy()
			process.exit()
		} else {
			message.react('❌')
			message.channel.send(messages.getPermissionsMessage())
		}
	}
}

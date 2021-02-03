const { MessageReaction } = require('discord.js')
const config = require('../config.json')
const messages = require('../functions/messages')
module.exports = {
	name: 'shutdown',
	description: 'Gracefully shuts down the bot',
	usage: 'shutdown',
	async execute(client, message, args, db) {
		if (config.settings.ownerid == message.author.id) {
			await message.channel.send('Shutting Down...')
			await message.react('👋')
			process.emit('SIGINT')
		} else {
			message.react('❌')
			message.channel.send(messages.getPermissionsMessage())
		}
	}
}

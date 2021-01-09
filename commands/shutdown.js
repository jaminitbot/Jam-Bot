const { MessageReaction } = require('discord.js');
const config = require('../config.json')
const messages = require('../functions/messages')
module.exports = {
	name: 'shutdown',
	description: 'STOPS THE BOT',
	usage: 'shutdown',
	async execute(client, message, args, db) {
		if (config.settings.ownerid == message.author.id){
			await client.destroy()
			await message.channel.send('Shutting Down...')
			return process.exit()
		} else {
			return message.channel.send(messages.getPermissionsMessage())
		}
        
	},
};
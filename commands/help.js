const fs = require('fs')
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js')) // Go through all the files in the root of the commands folder
const permission = require('../functions/permission')
module.exports = {
	name: 'help',
	description: 'Displays a list of avaliable commands',
	usage: '!help command',
	execute(client, message, args, db) {
		if (args[0]){
			const commandToFind = String(args[0]).toLowerCase()
			if (commandToFind && !(commandToFind == ' ')){
				try {
					var command = require(`../commands/${commandToFind}`)
				} catch {
					return message.channel.send('Specified command not found')
				}
				const usage = command.usage
				if (!usage) return message.channel.send('Command doesn\'t have a usage yet!')
				return message.channel.send(`${command.name}: ${usage}`)
			}
		}
		const commandToFind = String(args[0]).toLowerCase()
		let embed = {
			'title': 'Help',
			'description': 'You can view a list of commands [here](https://jam-bot-discord.github.io/Jam-Bot/)',
			'colour': '8c34eb'
		}
		message.channel.send({embed: embed})
	},
}
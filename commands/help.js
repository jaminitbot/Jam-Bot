const fs = require('fs')
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js')) // Go through all the files in the root of the commands folder
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
		let Helpmessage = "help: Displays this message, or shows the usage for a command"
		for (const file of commandFiles) {
			let addCommand = false
			const command = require(`../commands/${file}`)
			if (command && command.name && command.description){
				if (command.permissions){ // If the perms to run the command have been specified
					if (message.member.hasPermission(command.permissions)){ // Check if they have the perm
						addCommand = true // Show the command in the help text
					}
				} else {
					addCommand = true
				}
			}
			if (addCommand){
				Helpmessage = Helpmessage + '\n' + command.name + ': ' + command.description
			}
		}
		message.channel.send(Helpmessage)
	},
}
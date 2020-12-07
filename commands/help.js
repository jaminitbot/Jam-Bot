const fs = require('fs')
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js')) // Go through all the files in the root of the commands folder
module.exports = {
	name: 'help',
	description: 'Displays a list of avaliable commands',
	execute(client, message, args, db) {
		let Helpmessage = ""
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
				Helpmessage = Helpmessage + '\n' + command.name + ': ' + command.description // TODO: Add command useage
			}
		}
		message.channel.send(Helpmessage)
	},
}
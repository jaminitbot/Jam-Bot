const config = require('../config.json')
module.exports = {
	name: 'help',
	description: 'Displays information on a specifc command',
	usage: 'help command',
	execute(client, message, args, db) {
		db.get('SELECT "value" FROM "' + message.guild + '" WHERE key="prefix"', (err, row) => { // Get prefix
			if (err) console.log(err)
			if (row) {
				prefix = String(row.value)
			} else {
				prefix = config.defaults.prefix
			}
		})
		if (args[0]) { // User wants info on a particular command
			const commandToFind = String(args[0]).toLowerCase()
			if (commandToFind && !(commandToFind == ' ')) {
				try {
					var command = require(`../commands/${commandToFind}`)
				} catch {
					return message.channel.send('Specified command not found')
				}
				const description = command.description || 'None'
				const usage = command.usage || prefix + commandToFind
				const permissionsNeeded = command.permissions || 'None'
				var embed = {
					title: prefix + commandToFind,
					description: `${description}\nUsage: \`${prefix}${usage}\`\nPermissions needed to use: \`${permissionsNeeded}\``,
				}
			}
		} else { // No command specified, show generic help text
			var embed = {
				title: 'Help',
				description: `You can view a list of commands [here](https://jambot.jaminit.co.uk/commandlist.html?prefix=${prefix})`,
			}
		}
		embed.color = '0eacc4'
		message.channel.send({ embed: embed })
	}
}

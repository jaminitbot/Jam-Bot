const config = require('../config.json')
module.exports = {
	name: 'help',
	description: 'Displays a list of avaliable commands',
	usage: 'help command',
	execute(client, message, args, db) {
		db.get('SELECT "value" FROM "' + message.guild + '" WHERE key="prefix"', (err, row) => { // Get prefix
			if (err) console.log(err)
			if (row){
				prefix = String(row.value)
			} else {
				prefix = config.defaults.prefix
			}
		})
		if (args[0]){ // User wants info on a particular command
			const commandToFind = String(args[0]).toLowerCase()
			if (commandToFind && !(commandToFind == ' ')){
				try {
					var command = require(`../commands/${commandToFind}`)
				} catch {
					return message.channel.send('Specified command not found')
				}
				const usage = command.usage
				if (!usage) return message.channel.send('Command doesn\'t have a usage yet!')
				const permissionsNeeded = command.permissions || 'None'
				let embed = {
					'title': prefix + commandToFind,
					'description': `${command.description}\nUsage: ${prefix}${command.usage}\nPermissions needed to use: ${permissionsNeeded}`,
					'color': '0eacc4'
				}
				return message.channel.send({embed: embed})
			}
		}
		let embed = {
			'title': 'Help',
			'description': `You can view a list of commands [here](https://jam-bot-discord.github.io/Jam-Bot/?prefix=${prefix})`,
			'color': '0eacc4'
		}
		message.channel.send({embed: embed})
	},
}
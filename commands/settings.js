const prefix = require('./settings/prefix')
const modLog = require('./settings/modlog')

module.exports = {
	name: 'settings',
	description: 'Settings tings',
	permissions: 'ADMINISTRATOR',
	execute(client, message, args, db,) {
		if(!message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send('You don\'t have permission for that matey!')
		const embed = { // TODO: #4 Improve help text on settings
			'title': 'Settings',
			'description': 'prefix: Sets the prefix for the bot\nmodlog: Various modlog commands',
			'color': 7135759
		}
		const setting = args[0]
		if (!setting){ // If no setting was specified, show the help
			message.channel.send({ embed: embed })
			return
		}
		switch(String(setting).toLowerCase()){
		case 'prefix':
			prefix.execute(client, message, args, db)
			return
		case 'modlog':
			modLog.execute(client, message, args, db)
			return
		default:
			message.channel.send({ embed: embed })
			return
		}
	},
}
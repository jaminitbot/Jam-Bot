const prefix = require('./settings/prefix')
const modLog = require('./settings/modlog')
const suggestions = require('./settings/suggestions')
module.exports = {
	name: 'settings',
	description: 'Configures settings',
	permissions: 'MANAGE_GUILD',
	usage: '!settings',
	execute(client, message, args, db,) {
		if(!message.member.hasPermission(['MANAGE_CHANNELS'])) return message.channel.send('You don\'t have permission for that matey, you need the `Manage Server` permission!')
		const embed = { // TODO: #4 Improve help text on settings, maybe itterrate over like help command use
			'title': 'Settings',
			'description': 'prefix: Sets the prefix for the bot\nmodlog: Various modlog commands\nSuggestions: Sets the suggestion channel',
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
		case 'suggestions':
			suggestions.execute(client, message, args, db)
			return
		default:
			message.channel.send({ embed: embed })
			return
		}
	},
}
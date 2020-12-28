const fs = require('fs')
function generateEmbed(embed, modLogFiles) {
	for (const file of modLogFiles) {
		const command = require(`./modLog/${file}`)
		embed.description += `${command.name}: ${command.description}\n`
	}
	return embed
}
module.exports = {
	name: 'modlog',
	description: 'Various modlog related commands',
	usage: 'settings modlog SETTING VALUE',
	execute(client, message, args, db,) {
		const embed = {
			'title': 'Settings: Mod Log - Usage',
			'description': ''
		}
		const modLogFiles = fs.readdirSync('./commands/settings/modLog').filter(file => file.endsWith('.js'))
		const subSetting = args[1]
		if (!subSetting){
			return message.channel.send({'embed': generateEmbed(embed, modLogFiles)})
		}
		for (const file of modLogFiles) {
			const command = require(`./modLog/${file}`)
			if (String(subSetting).toLowerCase() == command.name){
				return command.execute(client, message, args, db)
			}
		}
		return message.reply({'content': 'I couldn\'t find that sub-setting!', 'embed': generateEmbed(embed, modLogFiles)})
	}
}
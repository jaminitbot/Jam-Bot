const fs = require('fs')
const messages = require('../functions/messages')
function generateEmbed(embed, settingsFiles) {
	for (const file of settingsFiles) {
		const command = require(`./settings/${file}`)
		embed.description += `${command.name}: ${command.description}\n`
	}
	return embed
}
module.exports = {
	name: 'settings',
	description: 'Configures the bot\'s settings',
	permissions: ['MANAGE_GUILD'],
	usage: 'settings',
	execute(client, message, args, db, logger) {
		// if (message.author.id == '707313027485270067') return message.channel.send(messages.getPermissionsMessage())
		const embed = {
			title: 'Settings - Usage',
			description: '',
			color: 7135759
		}
		const settingsFiles = fs.readdirSync('./commands/settings').filter(file => file.endsWith('.js'))
		const setting = args[0]
		if (!setting) { // If no setting was specified, show the help
			return message.channel.send({ embed: generateEmbed(embed, settingsFiles) })
		}
		for (const file of settingsFiles) {
			const command = require(`./settings/${file}`)
			if (String(setting).toLowerCase() == command.name) {
				return command.execute(client, message, args, db, logger)
			}
		}
		return message.reply({ content: 'I couldn\'t find that setting!', embed: generateEmbed(embed, settingsFiles) })
	}
}

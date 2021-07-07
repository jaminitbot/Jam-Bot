import { Message } from "discord.js"
import { client } from '../customDefinitions'

const fs = require('fs')
function generateEmbed(embed, settingsFiles) {
	for (const file of settingsFiles) {
		const command = require(`./settings/${file}`)
		embed.description += `${command.name}: ${command.description}\n`
	}
	return embed
}
export const name = 'settings'
export const description = "Configures the bot's settings"
export const permissions = ['MANAGE_GUILD']
export const usage = 'settings'
export function execute(client: client, message: Message, args) {
	const embed = {
		title: 'Settings - Usage',
		description: '',
		color: 7135759,
	}
	const settingsFiles = fs
		.readdirSync('./commands/settings')
		.filter((file) => file.endsWith('.js'))
	const setting = args[0]
	if (!setting) {
		// If no setting was specified, show the help
		return message.channel.send({
			embed: generateEmbed(embed, settingsFiles),
		})
	}
	for (const file of settingsFiles) {
		const command = require(`./settings/${file}`)
		if (String(setting).toLowerCase() == command.name) {
			return command.execute(client, message, args)
		}
	}
	return message.reply({
		content: "I couldn't find that setting!",
		embed: generateEmbed(embed, settingsFiles),
	})
}

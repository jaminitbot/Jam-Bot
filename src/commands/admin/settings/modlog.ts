import { Message } from "discord.js"
import { client } from '../../../customDefinitions'

const fs = require('fs')
function generateEmbed(embed, modLogFiles) {
	for (const file of modLogFiles) {
		const command = require(`./modLog/${file}`)
		embed.description += `${command.name}: ${command.description}\n`
	}
	return embed
}

export const name = 'modlog'
export const description = 'Various modlog related commands'
export const usage = 'settings modlog SETTING VALUE'
export function execute(client: client, message: Message, args) {

	const embed = {
		title: 'Settings: Mod Log - Usage',
		description: '',
	}
	const modLogFiles = fs
		.readdirSync('./commands/admin/settings/modLog')
		.filter((file) => file.endsWith('.js'))
	const subSetting = args[1]
	if (!subSetting) {
		return message.channel.send({
			embed: generateEmbed(embed, modLogFiles),
		})
	}
	for (const file of modLogFiles) {
		const command = require(`./modLog/${file}`)
		if (String(subSetting).toLowerCase() == command.name) {
			return command.execute(client, message, args)
		}
	}
	return message.reply({
		content: "I couldn't find that sub-setting!",
		embed: generateEmbed(embed, modLogFiles),
	})
}

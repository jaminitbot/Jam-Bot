import { Message } from "discord.js"
import { Logger } from "winston"
import { client } from '../custom'
import { getKey } from '../functions/db'

export const name = 'help'
export const description = 'Displays information on a specifc command'
export const usage = 'help command'
export async function execute(client: client, message: Message, args, logger: Logger) {

	let embed: object = {
		title: 'Help',
		description: `You can view a list of commands [here](https://jambot.jaminit.co.uk/docs/)`,
	}
	let messageContent
	if (args[0]) {
		// User wants info on a particular command
		const commandToFind = String(args[0]).toLowerCase()
		if (commandToFind && !(commandToFind == ' ')) {
			let prefix = await getKey(message.guild.id, 'prefix')
			if (!prefix) prefix = process.env.DEFAULTPREFIX
			if (client.commands.has(commandToFind)) {
				const command = client.commands.get(commandToFind)
				const description = command.description || 'None'
				const usage = command.usage || prefix + commandToFind
				const permissionsNeeded =
					command.permissions.toString() || 'None'
				embed = {
					title: prefix + commandToFind,
					description: `${description}\nUsage: \`${prefix}${usage}\`\nPermissions needed to use: \`${permissionsNeeded}\``,
				}
			} else {
				messageContent = 'Specifed command not found'
			}
		}
	}
	// @ts-expect-error
	embed.color = '0eacc4'
	// @ts-expect-error
	embed.footer = {
		text: `Intiated by ${message.author.tag}`,
		icon_url: message.author.displayAvatarURL(),
	}
	message.channel.send({ content: messageContent || '', embed: embed })
}

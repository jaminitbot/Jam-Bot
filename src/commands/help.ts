import {Message, MessageEmbed} from "discord.js"
import {Logger} from "winston"
import {client} from '../customDefinitions'
import {getKey} from '../functions/db'

export const name = 'help'
export const description = 'Displays information on a specifc command'
export const usage = 'help command'
export async function execute(client: client, message: Message, args, logger: Logger) {
	const embed = new MessageEmbed
	if (args[0]) {
		// User wants info on a particular command
		const commandToFind = String(args[0]).toLowerCase()
		if (commandToFind && !(commandToFind == ' ')) {
			const prefix = await getKey(message.guild.id, 'prefix') || process.env.DEFAULTPREFIX
			if (client.commands.has(commandToFind)) {
				embed.setTitle('Help: ' + prefix + commandToFind)
				const command = client.commands.get(commandToFind)
				const description = command.description ?? 'None'
				const usage = command.usage ? prefix + command.usage : prefix + commandToFind
				embed.addField('Description', description, true)
				embed.addField('Usage', usage, true)
				if (command.permissions) {
					const permissionsNeeded = command.permissions.toString()
					embed.addField('Permissions Needed', permissionsNeeded, true)
				}
			} else {
				return message.channel.send('Specified command not found :(')
			}
		}
	} else {
		// Generic help command
		embed.setTitle('Help')
		embed.setDescription('You can view a list of commands [here](https://jambot.jaminit.co.uk/docs/)')
	}
	embed.setColor('#439A86')
	message.channel.send(embed)
}

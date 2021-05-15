import { checkperm } from '../functions/util'
import { getKey } from '../functions/db'
const messages = require('../functions/messages')
const bannedIds = ['']

export async function register(client, message, logger) {
	if (message.author.bot) return
	if (message.channel.type === 'dm') {
		let embed = {
			description: message.content,
			color: '#20BE9D',
			author: {
				name: message.author.tag,
				icon_url:
					message.author.avatarURL() ||
					message.author.defaultAvatarURL,
			},
		}
		client.channels.cache
			.get(process.env.DmChannel)
			.send({ embed: embed })
		return
	}
	if (bannedIds.includes(message.author.id)) return
	const guild = message.guild
	let prefix = await getKey(guild.id, 'prefix')
	if (!prefix) prefix = process.env.DEFAULTPREFIX
	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const command = args.shift().toLowerCase()
	if (message.content.startsWith(prefix)) {
		if (!client.commands.has(command)) return // Doesn't have specified command
		try {
			if (client.commands.get(command).permissions) {
				if (
					!checkperm(
						message.member,
						client.commands.get(command).permissions
					)
				) {
					// User doesn't have specified permissions to run command
					message.react('❌')
					return message.channel.send(
						messages.getInvalidPermissionsMessage()
					)
				}
			}
			client.commands
				.get(command)
				.execute(client, message, args, logger)
		} catch (error) {
			// Error running command
			logger.error('Command failed with error: ' + error)
			message.reply(messages.getErrorMessage())
		}
	}
}

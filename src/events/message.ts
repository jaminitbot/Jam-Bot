import { checkPermissions, returnInvalidPermissionMessage } from '../functions/util'
import { getKey } from '../functions/db'
import { client } from '../customDefinitions'
import { Channel, Message } from 'discord.js'
import { Logger } from 'winston'

const messages = require('../functions/messages')
const bannedIds = ['']



export default async function register(client: client, message: Message) {
	if (message.author.bot) return
	//#region Dm code
	if (message.channel.type === 'dm') { // Bot has been dmed
		const embed = {
			description: message.content,
			color: '#20BE9D',
			author: {
				name: message.author.tag,
				icon_url:
					message.author.avatarURL() ||
					message.author.defaultAvatarURL,
			},
		}
		const dmChannel: Channel = await client.channels.fetch(process.env.DmChannel)
		if (!dmChannel) return
		if (dmChannel.type == 'text' || dmChannel.type == 'news') {
			// @ts-expect-error
			dmChannel.send({ embed: embed })
		}
		return
	}
	//#endregion
	if (bannedIds.includes(message.author.id)) return
	let prefix = await getKey(message.guild.id, 'prefix')
	if (!prefix) prefix = process.env.DEFAULTPREFIX
	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const command = args.shift().toLowerCase()
	if (message.content.startsWith(prefix)) {
		client.logger.verbose(`Command ${command ?? 'NULL'} has been run, executing command...`)
		if (!client.commands.has(command)) return client.logger.debug(`Command ${command ?? 'NULL'} doesn't exist, not continuing...`)// Doesn't have specified command
		try {
			if (client.commands.get(command).permissions) {
				if (!checkPermissions(message.member, client.commands.get(command).permissions)) {
					// User doesn't have specified permissions to run command
					client.logger.debug(`User ${message.author.tag} doesn't have the required permissions to run command ${command ?? 'NULL'}`)
					return returnInvalidPermissionMessage(message)
				}
			}
			client.commands
				.get(command)
				.execute(client, message, args)
		} catch (error) {
			// Error running command
			client.logger.error('Command failed with error: ' + error)
			await message.reply(messages.getErrorMessage())
		}
	}
}

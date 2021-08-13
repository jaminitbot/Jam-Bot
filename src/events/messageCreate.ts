import { checkPermissions, returnInvalidPermissionMessage } from '../functions/util'
import { getKey } from '../functions/db'
import { BotClient } from '../customDefinitions'
import { Message, MessageEmbed } from 'discord.js'

import { getErrorMessage } from '../functions/messages'
const bannedIds = ['']

// let mentionSlash = true
export default async function register(client: BotClient, message: Message) {
	if (message.author.bot) return
	if (bannedIds.includes(message.author.id)) return
	const guildId = message.guild ? message.guild.id : 0
	const prefix = await getKey(guildId, 'prefix') || process.env.defaultPrefix
	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const commandRequested = args.shift().toLowerCase()
	const command = client.commands.get(commandRequested) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandRequested));
	if (message.content.startsWith(prefix)) {
		if (!command) return client.logger.debug(`messageHandler: Command ${commandRequested ?? 'NULL'} doesn't exist, not continuing...`)// Doesn't have specified command
		client.logger.verbose(`messageHandler: Command ${commandRequested ?? 'NULL'} has been requested by ${message.author.tag}, executing command...`)
		if (message.channel.type == 'DM' && !command.allowInDm) return message.channel.send('Sorry, that command can only be run in a server!')
		// if (typeof command.executeSlash == 'function' && !command.exposeSlash && mentionSlash) {
		//     const slashCommandMessage = await message.reply(`Hey! There's this posh new thing called slash commands, and that command can be used with it! Try doing \`/${command.name}\`! They're so much easier to use :) \n*Dismissing this message for 20 seconds*`)
		//     mentionSlash = false
		//     setTimeout(() => mentionSlash = true, 20 * 1000)
		//     setTimeout(() => slashCommandMessage.delete(), 5 * 1000)
		// }
		if (command.permissions) {
			if (!checkPermissions(message.member, [...command.permissions])) {
				// User doesn't have specified permissions to run command
				client.logger.debug(`messageHandler: User ${message.author.tag} doesn't have the required permissions to run command ${commandRequested ?? 'NULL'}`)
				return returnInvalidPermissionMessage(message)
			}
		}
		try {
			command.execute(client, message, args)
		} catch (error) {
			// Error running command
			client.logger.error('messageHandler: Command failed with error: ' + error)
			message.reply(getErrorMessage())
		}
	} else {
		if (message.channel.type == 'DM' && process.env.dmChannel) {
			client.logger.verbose(`messageHandler: Received a DM from ${message.author.tag}, attempting to notify in the correct channel...`)
			const dmChannel = await client.channels.fetch(process.env.dmChannel)
			const embed = new MessageEmbed()
			if (message.content) embed.addField('Contents', message.content)
			if (message.attachments.first()) embed.setImage(message.attachments.first().url)
			embed.setAuthor(message.author.tag, message.author.avatarURL())
			embed.setFooter(`User ID: ${message.author.id}`)
			embed.setTimestamp(Date.now())
			// @ts-expect-error
			if (dmChannel.type == 'text' || dmChannel.type == 'news') dmChannel.send(embed)
		}
	}
}

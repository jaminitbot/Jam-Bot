import { Message, MessageEmbed, TextChannel } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
import { setKey, getKey } from '../functions/db'

const delay = require('delay')

export const name = 'suggest'
export const description = 'Suggests something'
export const usage = 'suggest Make a memes channel'
export async function execute(client: client, message: Message, args, logger: Logger) {
	if (!args[0])
		return message.reply('You need to specify what to suggest!')
	const suggestionChannel = await getKey(
		message.guild.id,
		'suggestionChannel'
	)
	if (!suggestionChannel)
		return message.channel.send(
			"Looks like suggestions haven't been setup here yet!"
		)
	// @ts-expect-error
	const channel: TextChannel = await client.channels.fetch(suggestionChannel)
	if (!channel) return message.channel.send('Error finding suggestions channel, perhaps it\'s being deleted')
	const suggestion = args.splice(0).join(' ')
	message.delete()
	let suggestionCount = await getKey(message.guild.id, 'suggestionCount')
	if (!suggestionCount) suggestionCount = 0
	suggestionCount = parseInt(suggestionCount)
	setKey(message.guild.id, 'suggestionCount', suggestionCount + 1)
	const embed = new MessageEmbed
	embed.setTitle(`Suggestion #${suggestionCount + 1}`)
	embed.addField('Description', suggestion)
	if (message.attachments.first()) {
		embed.setImage(message.attachments.first().url)
	}
	embed.setColor('#E9D985')
	embed.setFooter('Suggestion by ' + message.author.tag, message.author.displayAvatarURL())
	embed.setTimestamp(Date.now())
	const suggestmessage = await channel.send(embed)
	message.reply('Suggestion logged!')
	await suggestmessage.react('✅')
	await delay(1050)
	await suggestmessage.react('❌')
}

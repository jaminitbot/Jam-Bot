import { Message, MessageEmbed } from "discord.js"
import { BotClient } from '../customDefinitions'
import { getKey } from '../functions/db'
import { inputSnipe } from '../functions/snipe'
export const name = "messageDelete"
// https://coolors.co/aa8f66-ff0000-ffeedb-61c9a8-121619
export async function register(client: BotClient, message: Message): Promise<void> {
	if (message.partial) return
	if (!(message.channel.type == 'GUILD_NEWS' || message.channel.type == 'GUILD_TEXT')) return
	if (message.author.bot) return
	const owners = process.env.ownerId.split(',')
	if (owners.includes(message.author.id)) return
	await inputSnipe(message, null, 'delete')
	//#region Delete log code
	const logDeletes = await getKey(message.guild.id, 'logDeletedMessages')
	if (logDeletes) {
		const modLogChannelId = await getKey(message.guild.id, 'modLogChannel')
		if (!modLogChannelId) return
		let modLogChannel
		try {
			modLogChannel = await client.channels.fetch(modLogChannelId)
		} catch (err) {
			return
		}
		if (!modLogChannel || !((modLogChannel.type == 'GUILD_TEXT') || modLogChannel.type == 'GUILD_NEWS')) return
		const embed = new MessageEmbed
		embed.setAuthor(message.author.tag, message.author.avatarURL())
		embed.addField(`Message deleted in #${message.channel.name}`, message.content ?? '[No Content]', false)
		embed.setColor('#FF0000')
		embed.setFooter(`User ID: ${message.author.id}, Channel ID: ${message.channel.id}`)
		embed.setTimestamp(Date.now())
		modLogChannel.send({ embeds: [embed] })
	}
	//#endregion
}

import { Message, MessageEmbed } from "discord.js";
import { BotClient } from "src/customDefinitions";
import { inputSnipe } from '../functions/snipe'
import { getKey } from '../functions/db'
import { storeMessageEdit } from '../functions/stats'
export const name = "messageUpdate"

export async function register(client: BotClient, oldMessage: Message, newMessage: Message): Promise<void> {
	try {
		if (oldMessage.partial) await oldMessage.fetch(true)
		if (newMessage.partial) await newMessage.fetch(true)
	} catch {
		return
	}
	if (oldMessage.content == newMessage.content) return
	storeMessageEdit(newMessage)
	if (!(newMessage.channel.type == 'GUILD_TEXT' || newMessage.channel.type == 'GUILD_NEWS')) return
	if (newMessage.author.bot) return
	const owners = process.env.ownerId.split(',')
	if (owners.includes(newMessage.author.id)) return
	await inputSnipe(newMessage, oldMessage, 'edit')
	//#region Edit log
	const logEdits = await getKey(newMessage.guild.id, 'logDeletedMessages')
	if (logEdits) {
		const modLogChannelId = await getKey(newMessage.guild.id, 'modLogChannel')
		if (!modLogChannelId) return
		let modLogChannel
		try {
			modLogChannel = await client.channels.fetch(modLogChannelId)
		} catch (err) {
			return
		}
		if (!modLogChannel || !((modLogChannel.type == 'GUILD_TEXT') || modLogChannel.type == 'GUILD_NEWS')) return
		const embed = new MessageEmbed
		embed.setAuthor(newMessage.author.tag, newMessage.author.avatarURL())
		embed.addField(`Message edited in #${newMessage.channel.name}`, `**Before:** ${oldMessage.content ?? '[No Content]'}\n**After:** ${newMessage.content ?? '[No Content]'}`)
		embed.setFooter(`User ID: ${newMessage.author.id}, Channel ID: ${newMessage.channel.id}`)
		embed.setTimestamp(Date.now())
		embed.setColor('#61C9A8')
		try {
			await modLogChannel.send({ embeds: [embed] })
		} catch (err) {
			return
		}

	}
}
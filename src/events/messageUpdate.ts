import { Message, MessageEmbed } from "discord.js";
import { BotClient } from "src/customDefinitions";
import { inputSnipe } from '../functions/snipe'
import { storeMessageEdit } from '../cron/stats'
import { postToModlog } from "../functions/mod"
import { isBotOwner } from "../functions/util"
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
	await inputSnipe(newMessage, oldMessage, 'edit')
	if (isBotOwner(newMessage.author.id)) return
	//#region Edit Log
	const embed = new MessageEmbed
	embed.setAuthor(newMessage.author.tag, newMessage.author.avatarURL())
	embed.addField(`Message edited in #${newMessage.channel.name}`, `**Before:** ${oldMessage.content || '[No Content]'}\n**After:** ${newMessage.content || '[No Content]'}`)
	embed.setFooter(`User ID: ${newMessage.author.id} | Channel ID: ${newMessage.channel.id}`)
	embed.setTimestamp(Date.now())
	embed.setColor('#61C9A8')
	postToModlog(client, newMessage.guild.id, { embeds: [embed] }, 'messages')
	//#endregion
}
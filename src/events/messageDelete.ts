import { Message, MessageEmbed } from "discord.js"
import { BotClient } from '../customDefinitions'
import { inputSnipe } from '../functions/snipe'
import { storeMessageDelete } from '../cron/stats'
import { postToModlog } from "../functions/mod"
export const name = "messageDelete"
// https://coolors.co/aa8f66-ff0000-ffeedb-61c9a8-121619
export async function register(client: BotClient, message: Message): Promise<void> {
	if (message.partial) return
	storeMessageDelete(message)
	if (!(message.channel.type == 'GUILD_NEWS' || message.channel.type == 'GUILD_TEXT')) return
	if (message.author.bot) return
	await inputSnipe(message, null, 'delete')
	//#region Delete log code
	const embed = new MessageEmbed
	embed.setAuthor(message.author.tag, message.author.avatarURL())
	embed.addField(`Message deleted in #${message.channel.name}`, message.content || '[No Content]', false)
	embed.setColor('#FF0000')
	embed.setTimestamp(Date.now())
	embed.setFooter(`User ID: ${message.author.id}, Channel ID: ${message.channel.id}`)
	postToModlog(client, message.guild.id, { embeds: [embed] }, 'messages')
	//#endregion
}

import { Message, MessageEmbed } from 'discord.js'
import { BotClient } from 'src/customDefinitions'
import { inputSnipe } from '../functions/snipe'
import { postToModlog } from '../functions/mod'
import { isBotOwner } from '../functions/util'
import i18next from 'i18next'
export const name = 'messageUpdate'

export async function register(
	client: BotClient,
	oldMessage: Message,
	newMessage: Message
): Promise<void> {
	try {
		if (oldMessage.partial) await oldMessage.fetch(true)
		if (newMessage.partial) await newMessage.fetch(true)
	} catch {
		return
	}
	if (oldMessage.content == newMessage.content) return
	if (
		!(
			newMessage.channel.type == 'GUILD_TEXT' ||
			newMessage.channel.type == 'GUILD_NEWS'
		)
	)
		return
	if (newMessage.author.bot) return
	await inputSnipe(newMessage, oldMessage, 'edit')
	if (isBotOwner(newMessage.author.id)) return
	//#region Edit Log
	const embed = new MessageEmbed()
	embed.setAuthor(newMessage.author.tag, newMessage.author.avatarURL())
	embed.addField(
		i18next.t('events:messageLogs.EMBED_TITLE', {
			type: 'edited',
			channel: newMessage.channel.name,
		}),
		i18next.t('events:messageLogs.EDIT_ENTRY', {
			before:
				oldMessage.content ??
				i18next.t('events:messageLogs.NO_CONTENT'),
			after:
				newMessage.content ??
				i18next.t('events:messageLogs.NO_CONTENT'),
		})
	)
	embed.setFooter(
		i18next.t('events:messageLogs.EMBED_FOOTER', {
			userId: newMessage.author.id,
			channelId: newMessage.channel.id,
		})
	)
	embed.setTimestamp(Date.now())
	embed.setColor('#61C9A8')
	postToModlog(client, newMessage.guild.id, { embeds: [embed] }, 'messages')
	//#endregion
}

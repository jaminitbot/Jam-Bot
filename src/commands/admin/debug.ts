import { Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

import dayjs from "dayjs"
export const name = 'debug'
export const description = 'Displays debug information'
export const permissions = ['MANAGE_GUILD']
export const usage = 'debug'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	const sentMessage = await message.channel.send('Loading...')
	const uptimeDate = dayjs(Date.now() - client.uptime).format("HH:mm:ss [-] DD/MM/YYYY")
	const embed = new MessageEmbed
	embed.setTitle(i18next.t('debug.DEBUG_INFORMATION'))
	embed.addField(i18next.t('debug.ROUNDTRIP'), `${sentMessage.createdTimestamp - message.createdTimestamp}ms`, true)
	embed.addField(i18next.t('debug.API_LATENCY'), `${client.ws.ping}ms`, true)
	embed.addField(i18next.t('debug.UPTIME'), uptimeDate.toString(), true)
	embed.addField(i18next.t('debug.GUILD_ID'), message.guild.id, true)
	embed.setFooter(i18next.t('general:INITIATED_BY', { tag: message.author.tag }), message.author.displayAvatarURL())
	embed.setTimestamp(Date.now())
	embed.setColor('#222E50')
	sentMessage.edit({ content: null, embeds: [embed] })
}

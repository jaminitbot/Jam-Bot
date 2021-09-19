import { Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import dayjs from "dayjs"
export const name = 'debug'
export const description = 'Displays debug information'
export const permissions = ['ADMINISTRATOR']
export const usage = 'debug'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
export async function execute(client: BotClient, message: Message, args, transaction) {
	const sentMessage = await message.channel.send('Loading...')
	const uptimeDate = dayjs(Date.now() - client.uptime).format("HH:mm:ss [-] DD/MM/YYYY")
	const embed = new MessageEmbed
	embed.setTitle('Debug Information')
	embed.addField('Roundtrip', `${sentMessage.createdTimestamp - message.createdTimestamp}ms`, true)
	embed.addField('API Latency', `${client.ws.ping}ms`, true)
	embed.addField('Uptime', uptimeDate.toString(), true)
	embed.addField('Guild', message.guild.id, true)
	embed.addField('Revision', process.env.GIT_REV ?? 'N/A', true)
	embed.setFooter(`Initiated by ${message.author.tag}`, message.author.displayAvatarURL())
	embed.setTimestamp(Date.now())
	embed.setColor('#222E50')
	sentMessage.edit({ content: null, embeds: [embed] })
}

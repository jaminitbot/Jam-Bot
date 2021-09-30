import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from "i18next"

export const name = 'ping'
export const description = 'Displays various latency information'
export const usage = 'ping'
export const aliases = ['latency', 'pong']
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
function createLatencyEmbed(incomingMessageTimestamp: number, sentMessageTimestamp: number, client: BotClient) {
	const embed = new MessageEmbed
	embed.setDescription(`:stopwatch: ${sentMessageTimestamp - incomingMessageTimestamp}ms :hourglass: ${Math.round(client.ws.ping)}ms`)
	embed.setFooter(i18next.t('ping.PING_FOOTER'))
	embed.setColor('#FB21CB')
	return embed
}
export async function execute(client: BotClient, message: Message, args) {
	const sent = await message.channel.send('Pinging...')
	await sent.edit({ content: null, embeds: [createLatencyEmbed(message.createdTimestamp, sent.createdTimestamp, client)] })
	message.react('🏓')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const reply = await interaction.deferReply({ fetchReply: true })
	if (reply.type != 'APPLICATION_COMMAND') return
	const embed = createLatencyEmbed(interaction.createdTimestamp, reply.createdTimestamp, client)
	interaction.editReply({ embeds: [embed] })
}
import {Interaction, Message, MessageEmbed} from "discord.js"
import { client } from '../../customDefinitions'

export const name = 'ping'
export const description = 'Displays various latency information'
export const usage = 'ping'
export const aliases = ['latency', 'pong']
export const allowInDm = true
function createLatencyEmbed(incomingMessageTimestamp, sentMessageTimestamp, client) {
	const embed = new MessageEmbed
	embed.setDescription(`:stopwatch: ${sentMessageTimestamp - incomingMessageTimestamp}ms :hourglass: ${Math.round(client.ws.ping)}ms`)
	embed.setFooter('Roundtrip and api latency')
	embed.setColor('#FB21CB')
	return embed
}
export async function execute(client: client, message: Message, args) {
	const sent = await message.channel.send('Pinging...')
	await sent.edit({ content: null, embeds: [createLatencyEmbed(message.createdTimestamp, sent.createdTimestamp, client)] })
	message.react('🏓')
}
export async function executeSlash(client, interaction:Interaction) {
	if (!interaction.isCommand()) return
	interaction.reply({'content': `API latency: ${client.ws.ping}ms`})
}

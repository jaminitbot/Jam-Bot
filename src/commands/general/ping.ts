import {ButtonInteraction, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed} from "discord.js"
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
export async function executeSlash(client, interaction:CommandInteraction) {
	const reply = await interaction.defer({fetchReply:true})
	// @ts-expect-error
	const embed = createLatencyEmbed(interaction.createdTimestamp, reply.createdTimestamp, client)
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('ping-againButton')
				.setLabel('Ping again!')
				.setStyle('PRIMARY')
		)
	interaction.editReply({embeds: [embed], components: [row]})
}
export async function executeButton(client, interaction:ButtonInteraction) {
	if (interaction.customId == 'ping-againButton') {
		// @ts-expect-error
		executeSlash(client, interaction)
	}
}
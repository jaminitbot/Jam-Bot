import { ButtonInteraction, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'ping'
export const description = 'Displays various latency information'
export const usage = 'ping'
export const aliases = ['latency', 'pong']
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
function createLatencyEmbed(incomingMessageTimestamp, sentMessageTimestamp, client) {
	const embed = new MessageEmbed
	embed.setDescription(`:stopwatch: ${sentMessageTimestamp - incomingMessageTimestamp}ms :hourglass: ${Math.round(client.ws.ping)}ms`)
	embed.setFooter('Roundtrip and api latency')
	embed.setColor('#FB21CB')
	return embed
}
export async function execute(client: BotClient, message: Message, args) {
	const sent = await message.channel.send('Pinging...')
	await sent.edit({ content: null, embeds: [createLatencyEmbed(message.createdTimestamp, sent.createdTimestamp, client)] })
	message.react('🏓')
}
export async function executeSlash(client, interaction: CommandInteraction) {
	const reply = await interaction.deferReply({ fetchReply: true })
	// @ts-expect-error
	const embed = createLatencyEmbed(interaction.createdTimestamp, reply.createdTimestamp, client)
	// eslint-disable-next-line prefer-const
	let options = {
		embeds: null,
		components: null
	}
	// @ts-expect-error
	if (!interaction.noButton) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('ping-againButton')
					.setLabel('Ping again!')
					.setStyle('PRIMARY')
			)

		options.components = [row]
	} else {
		embed.setFooter('Requested again by ' + interaction.user.tag, interaction.user.avatarURL())
	}
	options.embeds = [embed]
	interaction.editReply(options)
}
export async function executeButton(client, interaction: ButtonInteraction) {
	if (interaction.customId == 'ping-againButton') {
		// @ts-expect-error
		interaction.noButton = true
		// @ts-expect-error
		executeSlash(client, interaction)
	}
}
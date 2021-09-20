import { MessageButton, Message, MessageEmbed, MessageActionRow, CommandInteraction } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'support'
export const description = 'Shows various support information'
export const usage = 'support'
export const allowInDm = false
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)

async function returnSupportEmbed() {
	const embed = new MessageEmbed
	embed.setTitle('Support information')
	embed.setDescription('Click the links below to see the command docs or join our support server!')
	const row = new MessageActionRow
	row.addComponents(
		new MessageButton()
			.setStyle('LINK')
			.setLabel('Command Docs')
			.setURL('https://jambot.jaminit.co.uk/#/'),
		new MessageButton()
			.setStyle('LINK')
			.setLabel('Support Server')
			.setURL('https://discord.gg/XpNeCGhTfx')
	)
	return [embed, row]
}
export async function execute(client: BotClient, message: Message, args: Array<unknown>, transaction) {
	const embedObject = await returnSupportEmbed()
	// @ts-expect-error
	message.channel.send({ embeds: [embedObject[0]], components: [embedObject[1]] })
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	const embedObject = await returnSupportEmbed()
	// @ts-expect-error
	interaction.reply({ embeds: [embedObject[0]], components: embedObject[1] })
}
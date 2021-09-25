import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { request } from 'undici'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from "i18next"

export const name = 'fox'
export const description = 'Fox'
export const usage = 'fox'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
async function returnFoxImage() {
	const response = await request(
		'https://randomfox.ca/floof/'
	)
	if (response.statusCode != 200) return i18next.t('general: API_ERROR')
	return (await response.body.json()).image ?? i18next.t('general:API_ERROR')
}
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	message.channel.send(await returnFoxImage())
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	interaction.editReply(await returnFoxImage())
}
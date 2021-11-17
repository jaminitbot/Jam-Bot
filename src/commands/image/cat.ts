import { CommandInteraction, Message } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { request } from 'undici'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

export const name = 'cat'
export const description = 'Purrrrrrr'
export const usage = 'cat'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
async function returnCatImage() {
	const response = await request('https://aws.random.cat/meow')
	if (response.statusCode != 200) return i18next.t('general:API_ERROR')
	return (await response.body.json()).file || i18next.t('general:API_ERROR')
}
export async function execute(
	client: BotClient,
	message: Message,
	args: Array<unknown>
) {
	message.channel.send(await returnCatImage())
}
export async function executeSlash(
	client: BotClient,
	interaction: CommandInteraction
) {
	await interaction.deferReply()
	interaction.editReply(await returnCatImage())
}

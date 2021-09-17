import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { request } from 'undici'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'bird'
export const description = 'Chirp'
export const usage = 'bird'
export const aliases = ['birb']
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
async function returnBirdUrl() {
	const response = await request(
		'https://some-random-api.ml/img/birb'
	)
	if (response.statusCode != 200) return 'The API seems to be returning errors, please try again later'
	return (await response.body.json()).link || "Unable to get a birb, the api's probably down"

}
export async function execute(client: BotClient, message: Message, args) {
	message.channel.send(await returnBirdUrl())
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	interaction.editReply(await returnBirdUrl())
}
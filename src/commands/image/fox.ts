import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { request } from 'undici'
import { SlashCommandBuilder } from '@discordjs/builders'

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
	if (response.statusCode != 200) return 'The API seems to be returning errors, please try again later.'
	return (await response.body.json()).image ?? "Unable to get a cute fox, the api's probably down :c"
}
export async function execute(client: BotClient, message: Message, args) {
	message.channel.send(await returnFoxImage())
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	interaction.editReply(await returnFoxImage())
}
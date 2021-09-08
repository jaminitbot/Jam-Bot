import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import axios from 'axios'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'koala'
export const description = 'Koala'
export const usage = 'koala'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
async function getKoalaImage() {
	const response = await axios.get(
		'https://some-random-api.ml/img/koala'
	)
	if (response.status != 200) return 'The API seems to be returning errors, please try again later'
	return response.data.link || "Unable to get a koala, the api's probably down"
}
export async function execute(client: BotClient, message: Message, args) {
	message.channel.send(await getKoalaImage())
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	interaction.editReply(await getKoalaImage())
}
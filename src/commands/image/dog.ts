import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import axios, { AxiosResponse } from 'axios'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'dog'
export const description = 'Gets a random dog picture, or a specific breed'
export const usage = 'dog'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('breed')
			.setDescription('(Optional) the breed of the dog to search for')
			.setRequired(false))
async function getDogPhoto(breed) {
	let response: AxiosResponse
	const breedArray = breed ? breed.trim().split(/ +/) : null
	if (!breed) {
		response = await axios.get(
			'https://dog.ceo/api/breeds/image/random'
		)
	} else if (breedArray[1]) {
		response = await axios.get(
			`https://dog.ceo/api/breed/${breedArray[1]}/${breedArray[0]}/images/random`
		)
	} else if (breedArray[0]) {
		response = await axios.get(
			`https://dog.ceo/api/breed/${breedArray[0]}/images/random`
		)
	}
	if (response.status != 200) return 'The API seems to be returning errors, please try again later'
	return response.data.message ?? "Unable to get a doggy, the api's probably down"
}
export async function execute(client: BotClient, message: Message, args) {
	let data
	if (args[0]) {
		if (args[1]) {
			// Wants to get breed and sub breed
			data = await getDogPhoto(args[0] + " " + args[1])
		} else {
			// Just breed
			data = await getDogPhoto(args[0])
		}
	} else {
		// Just random dog
		data = await getDogPhoto(null)
	}
	message.channel.send(data)
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	const breed = interaction.options.getString('breed') ?? null
	interaction.editReply(await getDogPhoto(breed))
}
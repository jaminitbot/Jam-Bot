import {CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'

export const name = 'dog'
export const description = 'Gets a random dog picture, or a specific breed'
export const usage = 'dog'
export const allowInDm = true
export const slashCommandOptions = [{
	name: 'breed',
	type: 'STRING',
	description: '(optional) the breed of the dog you\'d like to find',
	required: false
}]
async function getDogPhoto(breed) {
	let data
	const breedArray = breed ? breed.trim().split(/ +/) : null
	if (!breed) {
		data = await fetch(
			'https://dog.ceo/api/breeds/image/random'
		).then((response) => response.json())
	} else if (breedArray[1]) {
		data = await fetch(
			`https://dog.ceo/api/breed/${breedArray[1]}/${breedArray[0]}/images/random`
		).then((response) => response.json())
	} else if (breedArray[0]) {
		data = await fetch(
			`https://dog.ceo/api/breed/${breedArray[0]}/images/random`
		).then((response) => response.json())
	}
	return data.message ?? "Unable to get a doggy, the api's probably down"
}
export async function execute(client: client, message: Message, args) {
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
export async function executeSlash(client, interaction:CommandInteraction) {
	await interaction.defer()
	const breed = interaction.options.getString('breed') ?? null
	interaction.editReply(await getDogPhoto(breed))
}
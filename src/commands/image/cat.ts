import {CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'

export const name = 'cat'
export const description = 'Purrrr'
export const usage = 'cat'
export const allowInDm = true
async function returnCatImage() {
	const { file } = await fetch(
		'https://aws.random.cat/meow'
	).then((response) => response.json())
	return file || "Unable to get a kitty cat, the api's probably down"
}
export async function execute(client: client, message: Message, args) {
	message.channel.send(await returnCatImage())
}
export async function executeSlash(client, interaction:CommandInteraction) {
	await interaction.deferReply()
	interaction.editReply(await returnCatImage())
}
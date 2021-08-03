import {CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'

export const name = 'fox'
export const description = 'Fox'
export const usage = 'fox'
export const allowInDm = true
async function returnFoxImage() {
	const { image } = await fetch(
		'https://randomfox.ca/floof/'
	).then((response) => response.json())
	return image || "Unable to get a cute fox, the api's probably down :c"
}
export async function execute(client: client, message: Message, args) {
	message.channel.send(await returnFoxImage())
}
export async function executeSlash(client, interaction:CommandInteraction) {
	await interaction.defer()
	interaction.editReply(await returnFoxImage())
}
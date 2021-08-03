import {CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'

export const name = 'koala'
export const description = 'Koala'
export const usage = 'koala'
export const allowInDm = true
async function getKoalaImage() {
	const { link } = await fetch(
		'https://some-random-api.ml/img/koala'
	).then((response) => response.json())
	return link || "Unable to get a koala, the api's probably down"
}
export async function execute(client: client, message: Message, args) {
	message.channel.send(await getKoalaImage())
}
export async function executeSlash(client, interaction:CommandInteraction) {
	await interaction.defer()
	interaction.editReply(await getKoalaImage())
}
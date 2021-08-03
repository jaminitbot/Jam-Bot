import {CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'
import { randomInt } from '../../functions/util'
import {searchForImage} from './image'
export const name = 'frog'
export const description = 'Frog pics'
export const usage = 'frog'
export const aliases = ['forg']
export const allowInDm = true
export async function execute(client: client, message: Message, args) {
	const imageUrl = await searchForImage('frog', randomInt(1, 25), false, 'frog')
	message.channel.send(imageUrl)
}
export async function executeSlash(client, interaction:CommandInteraction) {
	await interaction.defer()
	const imageUrl = await searchForImage('frog', randomInt(1, 25), false, 'frog')
	interaction.editReply(imageUrl)
}
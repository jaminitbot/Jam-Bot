import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'owner'
export const description = 'Displays the owner of the bot'
export const usage = 'owner'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
export async function execute(client: client, message: Message, args) {
	message.channel.send(process.env.ownerName ?? 'Appears to be unknown')
}

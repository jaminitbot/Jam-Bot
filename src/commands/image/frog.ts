import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { randomInt } from '../../functions/util'
import { searchForImage } from './image'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'frog'
export const description = 'Frog pics'
export const usage = 'frog'
export const aliases = ['forg']
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
export async function execute(client: BotClient, message: Message, args, transaction) {
	const imageUrl = await searchForImage('frog', randomInt(1, 25), false, 'frog', client.logger, message.author, message.guild, 'prefix', transaction)
	await message.channel.send(imageUrl)
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	await interaction.deferReply()
	const imageUrl = await searchForImage('frog', randomInt(1, 25), false, 'frog', client.logger, interaction.user, interaction.guild, 'slash', transaction)
	await interaction.editReply(imageUrl)
}
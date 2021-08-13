import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { searchForImage } from './image'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'gif'
export const description = 'Gets a gif'
export const usage = 'gif hello'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('search')
			.setDescription('The text to search for')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('position')
			.setDescription('(Optional) the specific gif to get')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0]) return message.reply('you need to specify what to search for!')
	const sentMessage = await message.channel.send(`:mag_right: Finding gif...`)
	const search = args.join(' ') + ' gif'
	// @ts-expect-error
	const isNsfw = message.channel.nsfw
	const imageUrl = await searchForImage(search, 0, false, 'gif')
	sentMessage.edit(imageUrl)
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	const search = interaction.options.getString('search') + ' gif'
	console.log(search)
	const position = interaction.options.getInteger('position') || null
	// @ts-expect-error
	const isNsfw = interaction.channel.nsfw
	const imageUrl = await searchForImage(search, position, isNsfw, 'gif')
	interaction.editReply(imageUrl)
}
import {CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'
import {searchForImage} from './image'

export const name = 'gif'
export const description = 'Gets a gif'
export const usage = 'gif hello'
export const allowInDm = true
export const slashCommandOptions = [{
	name: 'search',
	type: 'STRING',
	description: 'The text to search for',
	required: true
},
	{
		name: 'position',
		type: 'INTEGER',
		description: '(optional) the specific position of gif to get',
		required: false
	}]
export async function execute(client: client, message: Message, args) {
	if (!args[0]) return message.reply('you need to specify what to search for!')
	const sentMessage = await message.channel.send(`:mag_right: Finding gif...`)
	const search = args.join(' ') + ' gif'
	// @ts-expect-error
	const isNsfw = message.channel.nsfw
	const imageUrl = await searchForImage(search, 0, false, 'gif')
	sentMessage.edit(imageUrl)
}
export async function executeSlash(client, interaction:CommandInteraction) {
	await interaction.deferReply()
	const search = interaction.options.getString('search') + ' gif'
	console.log(search)
	const position = interaction.options.getInteger('position') || null
	// @ts-expect-error
	const isNsfw = interaction.channel.nsfw
	const imageUrl = await searchForImage(search, position, isNsfw, 'gif')
	interaction.editReply(imageUrl)
}
import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import axios from 'axios'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getLogger } from "../../functions/util"

const logger = getLogger()
export const name = 'stock'
export const description = 'Gets a stock image'
export const usage = 'stock nature'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('search')
			.setDescription('The text to search for')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('position')
			.setDescription('The specific position to get')
			.setRequired(false))
export async function getStockImage(search: string, position: number) {
	if (!process.env.pexelsApiKey) return
	const response = await axios.get(
		`https://api.pexels.com/v1/search?query=${encodeURI(search)}&per_page=100`,
		{
			headers: {
				Authorization: process.env.pexelsApiKey,
			},
		}
	)
	if (response.status != 200) {
		logger.warn('stock: Pexels returned non-standard status code: ' + JSON.stringify(response.data))
		return 'The API seems to be returning errors, please try again later'
	}
	const json = response.data
	const photoPosition = position ?? 1
	if (1 > position || position > json.photos.length) return `There isn't a stock photo for position: ${position}`
	const image = json.photos[photoPosition - 1].src.medium // eslint-disable-line no-undef
	return image || 'Unable to get a stock photo, the api\'s probably down'
}
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0]) return message.reply('You need to specify what to search for!')
	const sent = await message.channel.send(':mag_right: Finding image...')
	const search = args.join(' ')
	sent.edit(await getStockImage(search, 1))

}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	const search = interaction.options.getString('search')
	const position = interaction.options.getInteger('position') ?? 1
	interaction.editReply(await getStockImage(search, position))
}
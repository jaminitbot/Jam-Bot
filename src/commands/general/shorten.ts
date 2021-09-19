import { CommandInteraction, Guild, Message, User } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { request } from "undici"
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'shorten'
export const description = 'Shortens a URL'
export const usage = 'shorten https://google.com'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('url')
			.setDescription('The URL to shorten')
			.setRequired(true))
export const slashCommandOptions = [{
	name: 'url',
	type: 'STRING',
	description: 'The URL to shorten',
	required: true
}]
const urlRegex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/)
async function shortenUrl(url: string, author: User, type: string, guild: Guild, transaction) {
	if (url.match(urlRegex)) {
		const data = await (await request('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url))).body.json()
		return data.shorturl || null
	}
	return 'That isn\'t a valid url! (Did you forget https)'
}
export async function execute(client: BotClient, message: Message, args, transaction) {
	if (!args[0]) return message.reply('you need to specify a url to shorten!')
	await message.channel.send(await shortenUrl(args[0], message.author, 'prefix', message.guild, transaction) || 'Error getting short url :(')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	let url = interaction.options.getString('url')
	url = await shortenUrl(url, interaction.user, 'slash', interaction.guild, transaction)
	let userOnly = false
	if (url) {
		url = `<${url}>`
	} else {
		url = 'Error getting short url :('
		userOnly = true
	}
	await interaction.reply({ content: url, ephemeral: userOnly })
}

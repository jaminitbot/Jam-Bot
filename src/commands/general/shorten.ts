import {Interaction, Message} from "discord.js"
import { client } from '../../customDefinitions'
import fetch from 'node-fetch'

export const name = 'shorten'
export const description = 'Shortens a URL'
export const usage = 'shorten https://google.com'
export const allowInDm = true
export const slashCommandOptions = [{
	name: 'url',
	type: 'STRING',
	description: 'The URL to shorten',
	required: true
}]
async function shortenUrl(url) {
	const data = await fetch(
		'https://is.gd/create.php?format=json&url=' +
		encodeURIComponent(url)
	).then((response) => response.json())
	return data.shorturl || null
}
export async function execute(client: client, message: Message, args) {
	if (!args[0]) return message.reply('you need to specify a url to shorten!')
	message.channel.send(await shortenUrl(args[0]))
}
export async function executeSlash(client, interaction:Interaction) {
	if (!interaction.isCommand()) return
	let url = interaction.options.getString('url')
	url = await shortenUrl(url)
	let userOnly = false
	if (url) {
		url = `<${url}>`
	} else {
		url = 'Error getting short url :('
		userOnly = true
	}
	interaction.reply({content: url, ephemeral: userOnly})
}

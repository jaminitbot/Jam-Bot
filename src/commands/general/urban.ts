/* eslint-disable @typescript-eslint/no-empty-function */
// @ts-nocheck
import { ButtonInteraction, CommandInteraction, SelectMenuInteraction, Message, ColorResolvable, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { request, Dispatcher } from 'undici'
import NodeCache from "node-cache"
import { randomInt } from '../../functions/util'

const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 })

export const name = 'urban'
export const description = 'Defines a word using urban dictionary'
export const usage = 'urban word'
export const allowInDm = false
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('word')
			.setDescription('The word you\'d like to define')
			.setRequired(true))

const colours: Array<ColorResolvable> = ['#805D93', '#F49FBC', '#FFD3BA', '#9EBD6E', '#169873', '#540D6E', '#EE4266']
async function returnDefineEmbed(wordToDefine: string) {
	let response: Dispatcher.ResponseData
	const cachedValue = cache.get(wordToDefine)
	if (!cachedValue) {
		let error: string
		try {
			response = await request('https://api.urbandictionary.com/v0/define?term=' + encodeURI(wordToDefine))
		} catch (err) {
			error = err
		}
		if (error || response.statusCode != 200) {
			cache.set(wordToDefine, 'NOT_FOUND')
		} else {
			cache.set(wordToDefine, (await response.body.json()).list)
		}
	}
	const jsonResponse = cache.get(wordToDefine)
	if (jsonResponse == 'NOT_FOUND' || !jsonResponse[0]) {
		const embed = new MessageEmbed
		embed.setDescription('No definitions found for: ' + wordToDefine)
		embed.setColor(colours[colours.length - 1])
		return embed
	}
	const embed = new MessageEmbed
	embed.setColor(colours[randomInt(0, colours.length - 1)])
	embed.setTitle(`Urban Dictionary: ${wordToDefine}`)
	let definition = String(jsonResponse[0].definition).replace(/\[|\]/g, '')
	if (definition.length > 1024) definition = definition.substring(0, 1024 - 3) + '...'
	embed.addField('Definition', definition)
	let example = String(jsonResponse[0].example).replace(/\[|\]/g, '')
	if (example.length > 1024) example = example.substring(0, 1024 - 3) + '...'
	example && embed.addField('Example', example)
	return embed
}
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	message.reply('Use slash commands smh')
	// message.channel.send({ embeds: [await returnDefineEmbed(args[0])] })
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	const word = interaction.options.getString('word')
	const embed = await returnDefineEmbed(word)
	interaction.editReply({ embeds: [embed] })
}

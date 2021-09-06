import { ColorResolvable, CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import axios, { AxiosResponse } from 'axios'
import { capitaliseSentence } from '../../functions/util'

export const name = 'define'
export const description = 'Defines a word'
export const usage = 'define word'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('word')
			.setDescription('The word you\'d like to define')
			.setRequired(true))
const colours: Array<ColorResolvable> = ['#805D93', '#F49FBC', '#FFD3BA', '#9EBD6E', '#169873', '#540D6E', '#EE4266']
async function returnDefineEmbed(wordToDefine: string) {
	let response: AxiosResponse
	let error
	try {
		response = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(wordToDefine))
	} catch (err) {
		error = err
	}
	if (String(error).includes('404') || response.status != 200) {
		const embed = new MessageEmbed
		embed.setDescription('No definitions found for: ' + wordToDefine)
		embed.setColor(colours[0])
		return [embed]
	}
	const jsonResponse = response.data[0]
	const embeds = []
	for (const meaning of jsonResponse.meanings) {
		const embed = new MessageEmbed
		colours[embeds.length] && embed.setColor(colours[embeds.length])
		embed.setTitle(`${capitaliseSentence(meaning.partOfSpeech)}: ${wordToDefine}`)
		let definitionNumber = 1
		for (const definition of meaning.definitions) {
			embed.addField(`Definition #${definitionNumber}`, `${capitaliseSentence(definition.definition) ?? '*Not Available*'}`)
			definitionNumber++
			if (embed.fields.length == 5) {
				break
			}
		}
		embeds.push(embed)
		if (embeds.length == 10) {
			break
		}
	}
	return embeds
}

export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	if (!args[0]) return message.reply('Do you just expect me to guess at what you want to define??!!')
	const embeds = await returnDefineEmbed(String(args.join(' ')).toLowerCase())
	const sentMessage = await message.channel.send({ content: 'Use slash commands next time smh', embeds: embeds })
	setTimeout(() => { sentMessage.edit({ content: null }) }, 5 * 1000)
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	const wordToDefine = interaction.options.getString('word')
	const embeds = await returnDefineEmbed(wordToDefine.toLowerCase())
	interaction.editReply({ embeds: embeds })
}

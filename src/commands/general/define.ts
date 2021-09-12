import { ColorResolvable, CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, SelectMenuInteraction, MessageButton, ButtonInteraction } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import axios, { AxiosResponse } from 'axios'
import { capitaliseSentence } from '../../functions/util'
import NodeCache from "node-cache"

const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 })

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
async function returnDefineEmbed(wordToDefine: string, interactionData) {
	let response: AxiosResponse
	let error
	const cachedValue = cache.get(wordToDefine)
	if (!cachedValue) {
		try {
			response = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(wordToDefine))
		} catch (err) {
			error = err
		}
		if (error || response.status != 200) {
			const embed = new MessageEmbed
			embed.setDescription('No definitions found for: ' + wordToDefine)
			embed.setColor(colours[0])
			return embed
		}
		cache.set(wordToDefine, response.data[0])
	}
	const jsonResponse = cache.get(wordToDefine) ?? response.data[0]
	const partOfSpeechTypes = []
	// eslint-disable-next-line prefer-const
	let meaningsJson = {}
	for (const meaning of jsonResponse.meanings) {
		partOfSpeechTypes.push({ label: capitaliseSentence(meaning.partOfSpeech), value: meaning.partOfSpeech })
		meaningsJson[meaning.partOfSpeech] = meaning.definitions
	}
	const wordToDefineHiphen = wordToDefine.split(' ').join('-')
	const selectRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('define-selectmenu-' + wordToDefineHiphen)
				.setPlaceholder(capitaliseSentence(interactionData['definitionType']) ?? partOfSpeechTypes[0]['label'])
				.addOptions(partOfSpeechTypes)
		)
	const embed = new MessageEmbed
	let definitionNumberStart = interactionData['definitionStart'] ?? 1
	if (1 > definitionNumberStart) definitionNumberStart = 1
	embed.setTitle(`${capitaliseSentence(interactionData['definitionType'] ?? partOfSpeechTypes[0]['value'])}: ${capitaliseSentence(wordToDefine)}`)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const definitionsArray: Array<any> = meaningsJson[interactionData['definitionType'] ?? partOfSpeechTypes[0]['value']]
	while (definitionNumberStart <= definitionsArray.length) {
		const definition = meaningsJson[interactionData['definitionType'] ?? partOfSpeechTypes[0]['value']][definitionNumberStart - 1]
		embed.addField(`Definition #${definitionNumberStart}`, `${capitaliseSentence(definition.definition) ?? '*Not Available*'}`)
		definitionNumberStart++
		if (embed.fields.length == 5) {
			break
		}
	}
	const pageNumber = Math.ceil(definitionNumberStart / 5)
	embed.setColor(colours[pageNumber])
	if (definitionNumberStart < definitionsArray.length || (1 < interactionData['definitionStart'] ?? 1)) {
		const buttonsRow = new MessageActionRow
		if (1 < interactionData['definitionStart'] ?? 1) {
			buttonsRow.addComponents(
				new MessageButton()
					.setCustomId('define-button-' + (interactionData['definitionStart'] - 5) + '-' + wordToDefineHiphen)
					.setLabel('Previous')
					.setStyle('PRIMARY')
			)
		}
		if (definitionNumberStart < definitionsArray.length) {
			buttonsRow.addComponents(
				new MessageButton()
					.setCustomId('define-button-' + definitionNumberStart + '-' + wordToDefineHiphen)
					.setLabel('Next')
					.setStyle('PRIMARY')
			)
		}
		return [embed, [buttonsRow, selectRow]]
	}
	return [embed, [selectRow]]
}

export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	message.channel.send('Use slash commands')
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	const wordToDefine = interaction.options.getString('word')
	const embed = await returnDefineEmbed(wordToDefine.toLowerCase(), {})
	interaction.editReply({ embeds: [embed[0]], components: embed[1] })
}

export async function executeButton(client: BotClient, interaction: ButtonInteraction) {
	const interactionNameObject = interaction.customId.split('-')
	const interactionData = { 'definitionStart': parseInt(interactionNameObject[2]) }
	const wordToDefine = interactionNameObject.splice(3).join(' ')
	const defineEmbedData = await returnDefineEmbed(wordToDefine, interactionData)
	interaction.update({ embeds: [defineEmbedData[0]], components: defineEmbedData[1] })
}

export async function executeSelectMenu(client: BotClient, interaction: SelectMenuInteraction) {
	const interactionNameObject = interaction.customId.split('-')
	const wordToDefine = interactionNameObject.splice(2).join(' ')
	const interactionData = { 'definitionType': interaction.values[0] }
	const defineEmbedData = await returnDefineEmbed(wordToDefine, interactionData)
	interaction.update({ embeds: [defineEmbedData[0]], components: defineEmbedData[1] })
}
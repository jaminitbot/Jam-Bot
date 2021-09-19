// TODO: Improve suggestions to allow for editing and implementation
import { CommandInteraction, Guild, Message, MessageEmbed, TextChannel, User } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { getNestedSetting, setNestedSetting } from '../../functions/db'
import { SlashCommandBuilder } from '@discordjs/builders'
import * as Sentry from "@sentry/node"

import delay from 'delay'

export const name = 'suggest'
export const description = 'Suggests something'
export const usage = 'suggest Make a memes channel'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('suggestion')
			.setDescription('The thing to suggest')
			.setRequired(true))
async function sendSuggestion(client: BotClient, suggestion: string, guildId: string, attachment: string, author: User, guild: Guild, type: string, transaction) {
	const suggestionChannelId = await getNestedSetting(guildId, 'suggestions', 'channel')
	if (!suggestionChannelId) return 1 // Suggestions aren't setup yet
	if (!(await getNestedSetting(guildId, 'suggestions', 'enabled'))) return 3 // Suggestions are disabled
	// @ts-expect-error
	const suggestionChannel: TextChannel = await client.channels.fetch(suggestionChannelId)
	if (!suggestionChannel) return 2 // Error finding suggestions channel
	let suggestionCount = await getNestedSetting(guildId, 'suggestions', 'suggestionCount')
	if (!suggestionCount) suggestionCount = 0
	suggestionCount = parseInt(suggestionCount)
	await setNestedSetting(guildId, 'suggestions', 'suggestionCount', suggestionCount + 1)
	const embed = new MessageEmbed
	embed.setTitle(`Suggestion #${suggestionCount + 1}`)
	embed.addField('Description', suggestion)
	if (attachment) {
		embed.setImage(attachment)
	}
	embed.setColor('#E9D985')
	embed.setFooter('Suggestion by ' + author.tag, author.displayAvatarURL())
	embed.setTimestamp(Date.now())
	const suggestionMessage = await suggestionChannel.send({ embeds: [embed] })
	try {
		await suggestionMessage.react('✅')
		await delay(1050)
		await suggestionMessage.react('❌')
	} catch {
		// Code
	}
	return 0
}
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0]) return message.reply('You need to specify what to suggest!')
	const transaction = Sentry.startTransaction({
		op: "suggestCommand",
		name: "Suggestion Command",
	})
	message.delete()
	const suggestionDescription = args.join(' ')
	const attachment = message.attachments.first() ? message.attachments.first().url : null
	const result = await sendSuggestion(client, suggestionDescription, message.guild.id, attachment, message.author, message.guild, 'prefix', transaction)
	if (result == 0) {
		await message.channel.send('Suggestion logged!')
	} else if (result == 1) {
		await message.channel.send('Whoops, suggestions aren\'t setup in this server yet!')
	} else if (result == 2) {
		await message.channel.send('There was an error finding the suggestions channel.')
	} else if (result == 3) {
		await message.channel.send('Whoops, suggestions are disabled in this server!')
	}
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	const suggestionDescription = interaction.options.getString('suggestion')
	const result = await sendSuggestion(client, suggestionDescription, interaction.guild.id, null, interaction.user, interaction.guild, 'slash', transaction)
	if (result == 0) {
		await interaction.reply({ content: 'Suggestion logged!', ephemeral: true })
	} else if (result == 1) {
		await interaction.reply({ content: 'Whoops, suggestions aren\'t setup in this server yet!', ephemeral: true })
	} else if (result == 2) {
		await interaction.reply('There was an error finding the suggestions channel.')
	} else if (result == 3) {
		await interaction.reply({ content: 'Whoops, suggestions are disabled in this server!', ephemeral: true })
	}
}
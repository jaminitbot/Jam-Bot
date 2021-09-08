// TODO: Improve suggestions to allow for editing and implementation
import { CommandInteraction, Message, MessageEmbed, TextChannel } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { getKey, setKey } from '../../functions/db'
import { SlashCommandBuilder } from '@discordjs/builders'

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
async function sendSuggestion(client: BotClient, suggestion: string, guildId: string, attachment: string, author) {
	const suggestionChannelId = await getKey(guildId, 'suggestionChannel')
	if (!suggestionChannelId) return 1 // Suggestions aren't setup yet
	// @ts-expect-error
	const suggestionChannel: TextChannel = await client.channels.fetch(suggestionChannelId)
	if (!suggestionChannel) return 2 // Error finding suggestions channel
	let suggestionCount = await getKey(guildId, 'suggestionCount')
	if (!suggestionCount) suggestionCount = 0
	suggestionCount = parseInt(suggestionCount)
	await setKey(guildId, 'suggestionCount', suggestionCount + 1)
	const embed = new MessageEmbed
	embed.setTitle(`Suggestion #${suggestionCount + 1}`)
	embed.addField('Description', suggestion)
	if (attachment) {
		embed.setImage(attachment)
	}
	embed.setColor('#E9D985')
	embed.setFooter('Suggestion by ' + author.tag, author.displayAvatarURL())
	embed.setTimestamp(Date.now())
	console.log(suggestionChannel)
	const suggestionMessage = await suggestionChannel.send({ embeds: [embed] })
	await suggestionMessage.react('✅')
	await delay(1050)
	await suggestionMessage.react('❌')
	return 0
}
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0]) return message.reply('You need to specify what to suggest!')
	message.delete()
	const suggestionDescription = args.join(' ')
	const attachment = message.attachments.first() ? message.attachments.first().url : null
	const result = await sendSuggestion(client, suggestionDescription, message.guild.id, attachment, message.author)
	if (result == 0) {
		message.channel.send('Suggestion logged!')
	} else if (result == 1) {
		message.channel.send('Whoops, suggestions aren\'t setup in this server yet!')
	} else if (result == 2) {
		message.channel.send('There was an error finding the suggestions channel.')
	}
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const suggestionDescription = interaction.options.getString('suggestion')
	const result = await sendSuggestion(client, suggestionDescription, interaction.guild.id, null, interaction.user)
	if (result == 0) {
		interaction.reply({ content: 'Suggestion logged!', ephemeral: true })
	} else if (result == 1) {
		interaction.reply({ content: 'Whoops, suggestions aren\'t setup in this server yet!', ephemeral: true })
	} else if (result == 2) {
		interaction.reply('There was an error finding the suggestions channel.')
	}
}
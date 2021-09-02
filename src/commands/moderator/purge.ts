import { CommandInteraction, Message, TextBasedChannels } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'

const messages = require('../../functions/messages')
const isNumber = require('is-number')

export const name = 'purge'
export const description = 'Bulk deletes messages'
export const permissions = ['MANAGE_MESSAGES']
export const usage = 'purge 10'
export const aliases = ['massdelete']
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addIntegerOption(option =>
		option.setName('number')
			.setDescription('The number of messages to delete')
			.setRequired(true))
export const slashCommandOptions = [{
	name: 'number',
	type: 'INTEGER',
	description: 'The number of messages to purge',
	required: true
}]
async function bulkDeleteMessages(channel: TextBasedChannels, NumOfMessagesToDelete) {
	if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') return
	if (!channel.guild.me.permissions.has(['MANAGE_MESSAGES'])) return 'I don\'t have permission to delete messages, ask an admin to check my permissions!'
	const deleteCount = parseInt(NumOfMessagesToDelete)
	if (deleteCount < 1) {
		return "You can't delete less than one message silly!"
	} else if (deleteCount > 100) {
		// Discord api doesn't let us do more than 100
		return "You can't delete more than 100 messages in one go!"
	}
	await channel.bulkDelete(deleteCount).catch((error) => {
		return messages.getErrorMessage()
	})
	return `Successfully deleted ${deleteCount} messages.`
}
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0]) return message.reply('You need to specify how many messages to purge!')
	if (!isNumber(args[0])) return message.reply('you need to specify a number!')
	await message.delete()
	await message.channel.send(await bulkDeleteMessages(message.channel, args[0]))
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const numOfMessages = interaction.options.getInteger('number')
	await interaction.reply({ content: await bulkDeleteMessages(interaction.channel, numOfMessages), ephemeral: true })
}
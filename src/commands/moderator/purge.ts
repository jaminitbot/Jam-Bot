import {Channel, CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'

const messages = require('../../functions/messages')
const isNumber = require('is-number')

export const name = 'purge'
export const description = 'Bulk deletes messages'
export const permissions = ['MANAGE_MESSAGES']
export const usage = 'purge 10'
export const aliases = ['massdelete']
export const slashCommandOptions = [{
	name: 'number',
	type: 'INTEGER',
	description: 'The number of messages to purge',
	required: true
}]
async function bulkDeleteMessages(channel: Channel, NumOfMessagesToDelete) {
	if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') return
	// @ts-expect-error
	if (!channel.guild.me.permissions.has(['MANAGE_MESSAGES'])) return "I don't have permission to perform this command, make sure I have the manage messages permission!"
	const deleteCount = parseInt(NumOfMessagesToDelete)
	if (deleteCount < 1) {return "You can't delete less than one message silly!"
	} else if (deleteCount > 99) {
		// Discord api doesn't let us do more than 100
		return "You can't delete more than 100 messages in one go!"
	}
	// @ts-expect-error
	channel.bulkDelete(deleteCount + 1).catch((error) => {
		// Delete +1 since we need to delete the initiating command as well
		return messages.getErrorMessage()
	})
	return `Successfully deleted ${deleteCount} messages.`
}
export async function execute(client: client, message: Message, args) {
	if (!args[0]) return message.reply('You need to specify how many messages to purge!')
	if (!isNumber(args[0])) return message.reply('you need to specify a number!')
	const sentMessage = await message.channel.send(await bulkDeleteMessages(message.channel, args[0]))
	setTimeout(() => sentMessage.delete(), 2 * 1000)
}
export async function executeSlash(client, interaction:CommandInteraction) {
	const numOfMessages = interaction.options.getInteger('number')
	// @ts-expect-error
	await interaction.reply(await bulkDeleteMessages(interaction.channel, numOfMessages))
	setTimeout(() => interaction.deleteReply(), 2 * 1000)
}
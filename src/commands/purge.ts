import { Message } from "discord.js"
import { client } from '../customDefinitions'

const messages = require('../functions/messages')
const isNumber = require('is-number')

export const name = 'purge'
export const description = 'Bulk deletes messages'
export const permissions = ['MANAGE_MESSAGES']
export const usage = 'purge 10'
export const aliases = ['massdelete']
export function execute(client: client, message: Message, args) {
	if (!(message.channel.type == 'news' || message.channel.type == 'text')) return
	if (!args[0])
		return message.reply(
			'You need to specify how many messages to purge!'
		)
	if (!isNumber(args[0]))
		return message.reply('you need to specify a number!')
	if (!message.guild.me.hasPermission(['MANAGE_MESSAGES']))
		return message.channel.send(
			"I don't have permission to perform this command, make sure I have the manage messages permission!"
		)
	const deleteCount = parseInt(args[0], 10)
	if (deleteCount < 1) {
		return message.reply(
			"You can't delete less than one message silly!"
		)
	} else if (deleteCount > 99) {
		// Discord api doesn't let us do more than 100
		return message.reply(
			"You can't delete more than 100 messages in one go!"
		)
	}
	message.channel.bulkDelete(deleteCount + 1).catch((error) => {
		// Delete +1 since we need to delete the intiating command as well
		client.logger.error('Error when deleting messages: ' + error)
		message.channel.send(messages.getErrorMessage())
	})
}

const messages = require('../functions/messages')
const isNumber = require('is-number')
module.exports = {
	name: 'purge',
	description: 'Bulk deletes messages',
	permissions: ['MANAGE_MESSAGES'],
	usage: 'purge 10',
	execute(client, message, args, db, logger) {
		if (message.author.id == '707313027485270067') return message.channel.send(messages.getInvalidPermissionsMessage()) // Dom
		if (!args[0]) return message.reply('You need to specify how many messages to purge!')
		if (!isNumber(args[0])) return message.reply('you need to specify a number!')
		if (!message.guild.me.hasPermission(['MANAGE_MESSAGES'])) return message.channel.send('I don\'t have permission to perform this command, make sure I have the manage messages permission!')
		const deleteCount = parseInt(args[0], 10)
		if (deleteCount < 1) {	
			return message.reply('You can\'t delete less than one message silly!')
		} else if (deleteCount > 99) { // Discord api doesn't let us do more than 100
			return message.reply('You can\'t delete more than 99 messages in one go!')
		}
		message.channel.bulkDelete(deleteCount + 1).catch(error => { // Delete +1 since we need to delete the intiating command as well
			logger.error('Error when deleting messages: ' + error)
			message.channel.send(messages.getErrorMessage())
		})
	}
}

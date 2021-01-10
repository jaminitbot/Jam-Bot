const messages = require('../functions/messages')
module.exports = {
	name: 'purge',
	description: 'Bulk deletes messages',
	permissions: ['MANAGE_MESSAGES'],
	usage: 'purge 10',
	execute(client, message, args, db) {
		if (message.author.id == '707313027485270067') return messsage.channel.send('Go away dom')
		if (!args[0]) return message.reply('Usage: ' + this.usage)
		if(!message.guild.me.hasPermission(['MANAGE_MESSAGES'])) return message.channel.send('I dont have permission to perform this command, make sure I have the manage messages permission!')
		const deleteCount = parseInt(args[0], 10)
		if (!deleteCount) {
			message.reply('You need to specify how many messages to delete!')
			return
		} else if (deleteCount < 1){
			message.reply('You can\'t delete less than one message silly!')
			return
		} else if (deleteCount > 99){ // Discord api doesn't let us do more than 100
			message.reply('You can\'t delete more than 99 messages in one go!')
			return
		}
		message.channel.bulkDelete(deleteCount + 1).catch(error => {
			console.error('Error when deleting messages: ' + error)
			message.channel.send(messages.getErrorMessage())
		})
	},
}
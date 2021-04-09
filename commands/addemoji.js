const messages = require('../functions/messages')
module.exports = {
	name: 'addemoji',
	description: 'Adds an emoji to the server',
	usage: 'addemoji EmojiName',
	execute(client, message, args, db, logger) {
		if (!args[0]) return message.reply('you need to specify a name for your emoji!')
		let url = message.attachments.first()
		if (!url) return message.reply('you need to attach the image of the emoji!')
		message.guild.emojis.create(url.url, args[0], { reason: `Uploaded by: ${message.author.tag}, ${message.author.id}` })
			.then(emoji => {
				message.channel.send(`The emoji "${emoji.name}" was created!`).then(sent => {
					sent.react(emoji.identifier)
					message.react(emoji.identifier)
				})
			})
			.catch(error => {
				logger.error(error)
				message.channel.reply('uwu senpai, loowks like youwr image is a liwttle too big!')
			})
	},
}
module.exports = {
	name: 'addemoji',
	description: 'Adds an emoji to the server',
	usage: 'addemoji EmojiName',
	execute(client, message, args, db) {
		if (!args[0]) return message.reply('you need to specify the name of your emoji!')
		let url = message.attachments.first()
		if (!url) return message.reply('you need to attach the image!')
		message.guild.emojis.create(url.url, args[0])
			.then(emoji =>{
				message.channel.send(`The emoji "${emoji.name}" was created!`).then(sent => {
					sent.react(emoji.identifier)
					message.react(emoji.identifier)
				})
			})
			.catch(console.error)
	},
}
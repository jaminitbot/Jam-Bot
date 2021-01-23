module.exports = {
	name: 'addemoji',
	description: 'Purges messages',
	permissions: '',
	usage: 'addemoji https://example.com/yes.jpg YesEmote',
	execute(client, message, args, db) {
		if (!args[0]) return message.reply('Name your emoji')
		var url = message.attachments.first()
		if (!url) return message.reply('Attach an image')
		message.guild.emojis.create(url, args[1])
			.then(emoji => message.channel.send(`Created new emoji with name ${emoji.name}!`))
			.catch(console.error)
	},
}
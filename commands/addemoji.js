module.exports = {
	name: 'addemoji',
	description: 'Purges messages',
	permissions: '',
	usage: 'addemoji https://example.com/yes.jpg YESEMOTE',
	execute(client, message, args, db) {
		if (!args[0] || !args[1]) return message.reply('Usage: ' + this.usage)
		message.guild.emojis.create(args[0], args[1])
			.then(emoji => message.channel.send(`Created new emoji with name ${emoji.name}!`))
			.catch(message.channel.send('Error making emoji!'))
	},
}
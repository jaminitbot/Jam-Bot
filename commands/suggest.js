module.exports = {
	name: 'suggest',
	description: 'Suggests something',
	usage: 'suggest Make a memes channel',
	execute(client, message, args, db, logger) {
		if (!args[0]) return message.reply('You need to specify what to suggest!')
		db.get('SELECT "value" FROM "' + message.guild + '" WHERE key="suggestionChannel"', (err, row) => { // Get channel
			if (!row) return message.channel.send('Looks like suggestions haven\'t been setup here yet!')
			const channel = client.channels.cache.get(row.value)
			const suggestion = args.splice(0).join(' ')
			if (!channel) return message.channel.send('Error finding suggestions channel, perhaps it\'s being deleted')
			message.delete()
			const embed = {
				title: 'Suggestion by ' + message.author.tag,
				description: suggestion,
				color: 65511,
				thumbnail: {
					url: message.author.displayAvatarURL()
				}
			}
			const suggestmessage = channel.send({ embed: embed })
			suggestmessage.then((message) => {
				message.react('✅')
					.then(() => (message.react('❌')))
			})
			message.reply('Suggestion logged!')
		})
	}
}

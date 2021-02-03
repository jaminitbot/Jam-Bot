module.exports = {
	register(client, message, db) {
		if (message.author.bot) return
		db.get('SELECT "value" FROM "' + message.guild + '" WHERE key="logDeletedMessages"', (err, row) => { // Checks whether we should log this
			if (err) return
			if (!row) return
			if (row.value == 'on') {
				db.get('SELECT "value" FROM "' + message.guild + '" WHERE key="modLogChannel"', (err, row) => { // If its on, get the id of the channel
					if (err) return
					if (!row) return
					const modLogChannel = client.channels.cache.get(row.value)
					if (!modLogChannel) return
					const embed = {
						title: 'Message deleted',
						description: `Message deleted in ${message.channel} by ${message.author}:\n${message.content}`
					}
					modLogChannel.send({ embed: embed })
				})
			}
		})
	}
}

const config = require('../config.json')
const database = require('../functions/db')
module.exports = {
	register(client, message, db) {
		if (message.author.bot) return
		if (message.author.id == config.settings.ownerid) return
		let logDeletes = database.get(db, message.guild, 'logDeletedMessages')
		if (!logDeletes) return
		if (logDeletes == 'on') {
			let modLogChannnel = database.get(db, message.guild, 'modLogChannel')
			if (!modLogChannnel) return
			const modLogChannel = client.channels.cache.get(modLogChannnel)
			if (!modLogChannel) return
			let embed = {
				title: 'Message deleted',
				description: `Message deleted in ${message.channel} by ${message.author}:\n${message.content}`,
				color: ' #FF0000',
				timestamp: Date.now()
			}
			modLogChannel.send({ embed: embed })
		}
	}
}

const fetch = require('node-fetch')
const database = require('../functions/db')
const messages = require('../functions/messages')
module.exports = {
	async execute(client, db, config) {
		const response = await fetch('https://api.twitch.tv/helix/search/channels?query=honkserini', {
			headers: {
				'CLIENT-ID': config.settings.twitchApiClientId,
				'Authorization': 'Bearer ' + config.settings.twitchApiSecret
			}
		})
		const json = await response.json()
		const data = json.data[0]
		if (data.is_live) {
			db.get('SELECT "value" FROM "' + '779060204528074783' + '" WHERE key="LiveTime"', (err, row) => {
				if (err) return
				const notificationChannel = client.channels.cache.get('780071463473643550')
				if (!notificationChannel) return
				if (row) if (row.value == data.started_at) {
					db.get('SELECT "value" FROM "' + '779060204528074783' + '" WHERE key="LiveTitle"', (err, row) => {
						if (!row) return
						if (data.title == row.value) {
							return
						} else {
							db.get('SELECT "value" FROM "' + '779060204528074783' + '" WHERE key="LiveMessageId"', (err, row) => {
								if (!row) return
								const messageToUpdate = await notificationChannel.messages.fetch(row.value)
								messageToUpdate.edit(`${messages.getHappyMessage()} @everyone ${data.display_name} is live streaming: ${data.title}\n<https://www.twitch.tv/honkserini>`)
							})
						}
					})
					
				}
				database.updateKey(db, '779060204528074783', 'LiveTime', data.started_at)
				const sentMessage = await notificationChannel.send(`${messages.getHappyMessage()} @everyone ${data.display_name} is live streaming: ${data.title}\n<https://www.twitch.tv/honkserini>`)
				database.updateKey(db, '779060204528074783', 'LiveMessageId', sentMessage.id)
			})
		}
	}
}

const fetch = require('node-fetch')
const database = require('../functions/db')
const messages = require('../functions/messages')
const md5 = require('md5')
module.exports = {
	async execute(client, db, config) {
		if (!config.settings.twitchApiClientId || !config.settings.twitchApiSecret) return
		const response = await fetch('https://api.twitch.tv/helix/search/channels?query=' + config.settings.twitchNotificationsUsername, {
			headers: {
				'CLIENT-ID': config.settings.twitchApiClientId,
				'Authorization': 'Bearer ' + config.settings.twitchApiSecret
			}
		})
		const json = await response.json()
		const data = json.data[0]
		if (data.is_live) {
			let LiveTime = await database.get(db, 'SELECT "value" FROM "' + config.settings.twitchNotificationsGuild + '" WHERE key="LiveTime"')
			const notificationChannel = client.channels.cache.get(config.settings.twitchNotificationsChannel)
			if (!notificationChannel) return
			if (LiveTime.value == data.started_at) {
				let LiveTitle = await database.get(db, 'SELECT "value" FROM "' + config.settings.twitchNotificationsGuild + '" WHERE key="LiveTitle"')
				if (!LiveTitle) return
				if (md5(data.title) == LiveTitle.value) {
					return
				} else {
					database.updateKey(db, config.settings.twitchNotificationsGuild, 'LiveTitle', md5(data.title))
					let MessageId = await database.get(db, 'SELECT "value" FROM "' + config.settings.twitchNotificationsGuild + '" WHERE key="LiveMessageId"')
					if (!MessageId) return
					let messageToUpdate = await notificationChannel.messages.fetch(MessageId.value)
					messageToUpdate.edit(`${messages.getHappyMessage()} @everyone ${data.display_name} is live streaming: ${data.title}\n<https://www.twitch.tv/${data.broadcaster_login}>`)
					return
				}
			}
			database.updateKey(db, config.settings.twitchNotificationsGuild, 'LiveTime', data.started_at)
			const sentMessage = await notificationChannel.send(`${messages.getHappyMessage()} @everyone ${data.display_name} is live streaming: ${data.title}\n<https://www.twitch.tv/${data.broadcaster_login}>`)
			database.updateKey(db, config.settings.twitchNotificationsGuild, 'LiveMessageId', sentMessage.id)
		}
	}
}

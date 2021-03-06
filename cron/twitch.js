const fetch = require('node-fetch')
const database = require('../functions/db')
const messages = require('../functions/messages')
const sha1 = require('sha1')
const message = require('../events/message')
module.exports = {
	async execute(client, db, config, logger) {
		if (!config.settings.twitchApiClientId || !config.settings.twitchApiSecret) return
		if (!config.settings.twitchNotificationsChannel || !config.settings.twitchNotificationsGuild) return
		const response = await fetch('https://api.twitch.tv/helix/search/channels?query=' + config.settings.twitchNotificationsUsername, {
			headers: {
				'CLIENT-ID': config.settings.twitchApiClientId,
				'Authorization': 'Bearer ' + config.settings.twitchApiSecret
			}
		})
		const json = await response.json()
		const data = json.data[0]
		if (data.is_live) { // Checks if broadcaster is live
			const notificationChannel = client.channels.cache.get(config.settings.twitchNotificationsChannel)
			if (!notificationChannel) return
			let LiveTime = await database.get(db, 'SELECT "value" FROM "' + config.settings.twitchNotificationsGuild + '" WHERE key="LiveTime"')
			if (LiveTime.value == data.started_at) { // Checks if we have already notified for this live
				LiveTitle = await database.get(db, 'SELECT "value" FROM "' + config.settings.twitchNotificationsGuild + '" WHERE key="LiveTitle"')
				if (!LiveTitle) {
					database.updateKey(db, config.settings.twitchNotificationsGuild, 'LiveTitle', sha1(data.title))
				}
				// NOTE: hash because we don't want the title to contain SQL escaping characters
				if (sha1(data.title) == LiveTitle.value) { // If the title in the message and title of stream is the same, do nothing
					return 
				} else { // If not
					database.updateKey(db, config.settings.twitchNotificationsGuild, 'LiveTitle', sha1(data.title)) // Put the new title in the db
					let MessageId = await database.get(db, 'SELECT "value" FROM "' + config.settings.twitchNotificationsGuild + '" WHERE key="LiveMessageId"') // Get the message id of the notiication we sent
					if (MessageId) {
						let messageToUpdate = await notificationChannel.messages.fetch(MessageId.value) // Get the message object
						await messageToUpdate.edit(`${messages.getHappyMessage()} \<@&814796307402457148> ${data.display_name} is live streaming: ${data.title}\n<https://www.twitch.tv/${data.broadcaster_login}>`) // Edit the notification message with the new title
						return
					}

				}
			} else { // We haven't notified for this live
				database.updateKey(db, config.settings.twitchNotificationsGuild, 'LiveTime', data.started_at) // Put the time of live in db so we don't notify twice
				const sentMessage = await notificationChannel.send(`${messages.getHappyMessage()} \<@&814796307402457148> ${data.display_name} is live streaming: ${data.title}\n<https://www.twitch.tv/${data.broadcaster_login}>`) // Notify for the live in the right channel
				database.updateKey(db, config.settings.twitchNotificationsGuild, 'LiveMessageId', sentMessage.id) // Put the notification message id in db so we can edit the message later
			}
		}
	}
}

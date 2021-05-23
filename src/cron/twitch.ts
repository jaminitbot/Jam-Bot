import { client } from '../customDefinitions'
import { Logger } from 'winston'
import fetch from 'node-fetch'
import { TextChannel } from 'discord.js'
import { getKey, setKey } from '../functions/db'
const messages = require('../functions/messages')
import sha1 = require('sha1')

export default async function execute(client: client, logger: Logger) {
	if (!process.env.twitchApiClientId || !process.env.twitchApiSecret) return
	if (!process.env.twitchNotificationsChannel || !process.env.twitchNotificationsGuild) return
	if (process.env.NODE_ENV !== 'production') console.log('Checking if Twitch channel is live')
	const response = await fetch(
		'https://api.twitch.tv/helix/search/channels?query=' +
		process.env.twitchNotificationsUsername,
		{
			headers: {
				'CLIENT-ID': process.env.twitchApiClientId,
				Authorization: 'Bearer ' + process.env.twitchApiSecret,
			},
		}
	)
	const json = await response.json()
	const liveInfo = json.data[0]
	const guildId = process.env.twitchNotificationsGuild
	if (liveInfo.is_live) {
		// Checks if broadcaster is live
		if (process.env.NODE_ENV !== 'production') console.log('Twitch channel is live')
		const notificationChannel = client.channels.cache.get(process.env.twitchNotificationsChannel)
		const notificationMessageContent = `<@&814796307402457148> ${messages.getHappyMessage()} ${liveInfo.display_name} is live streaming!`
		const time = new Date()
		const embed = {
			"title": `https://twitch.tv/${liveInfo.display_name}`,
			"url": `https://twitch.tv/${liveInfo.display_name}`,
			"description": liveInfo.title,
			"color": 6570404,
			"footer": {
				"text": `Last updated at: ${time.getUTCHours()}:${time.getUTCMinutes()} UTC`
			},
			"author": {
				"name": `${liveInfo.display_name} is streaming!`
			},
			"fields": [
				{
					"name": "Playing",
					"value": liveInfo.game_name,
					"inline": true
				},
				{
					"name": "Started at (UTC)",
					"value": liveInfo.started_at,
					"inline": true
				}
			]
		}
		if (!notificationChannel) return
		const LiveTime = await getKey(guildId, 'LiveTime')
		if (LiveTime == liveInfo.started_at) {
			// Checks if we have already notified for this live
			const savedLiveIdentifier = await getKey(guildId, 'LiveIdentifier')
			const newLiveIdentifier = sha1(liveInfo.title + liveInfo.game_name)
			if (!savedLiveIdentifier) {
				setKey(guildId, 'LiveIdentifier', newLiveIdentifier)
			}
			// NOTE: hash because we don't want the title to contain SQL escaping characters
			if (newLiveIdentifier == savedLiveIdentifier) {
				// If the title in the message and title of stream is the same, do nothing
				return
			} else {
				// If not
				if (process.env.NODE_ENV !== 'production') console.log('Stream info has changed, updating')
				setKey(guildId, 'LiveIdentifier', newLiveIdentifier) // Put the new title in the db
				const MessageId = await getKey(guildId, 'LiveMessageId') // Get the message id of the notiication we sent
				if (MessageId) {
					// @ts-expect-error
					const messageToUpdate = await notificationChannel.messages.fetch(MessageId) // Get the message object
					await messageToUpdate.edit({ content: notificationMessageContent, embed: embed }) // Edit the notification message with the new title
				}
			}
		} else {
			// We haven't notified for this live
			setKey(guildId, 'LiveTime', liveInfo.started_at) // Put the time of live in db so we don't notify twice
			// @ts-expect-error
			const sentMessage = await notificationChannel.send({ content: notificationMessageContent, embed: embed }) // Notify for the live in the right channel
			if (sentMessage.channel.type == 'news') {
				sentMessage.crosspost()
			}
			setKey(guildId, 'LiveMessageId', sentMessage.id) // Put the notification message id in db so we can edit the message later
		}
	}
}

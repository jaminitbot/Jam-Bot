import { client } from '../custom'
import { Logger } from 'winston'
import fetch from 'node-fetch'
import { TextChannel } from 'discord.js'
import { getKey, setKey } from '../functions/db'
const messages = require('../functions/messages')
import sha1 = require('sha1')
import { homedir } from 'os'

export default async function execute(client: client, logger: Logger) {
	if (!process.env.twitchApiClientId || !process.env.twitchApiSecret)
		return
	if (
		!process.env.twitchNotificationsChannel ||
		!process.env.twitchNotificationsGuild
	)
		return
	if (process.env.NODE_ENV !== 'production')
		console.log('Checking if Twitch channel is live')
	let response = await fetch(
		'https://api.twitch.tv/helix/search/channels?query=' +
		process.env.twitchNotificationsUsername,
		{
			headers: {
				'CLIENT-ID': process.env.twitchApiClientId,
				Authorization: 'Bearer ' + process.env.twitchApiSecret,
			},
		}
	)
	let json = await response.json()
	const data = json.data[0]
	let guildId = process.env.twitchNotificationsGuild
	if (data.is_live) {
		// Checks if broadcaster is live
		if (process.env.NODE_ENV !== 'production')
			console.log('Twitch channel is live')
		// @ts-expect-error
		const notificationChannel: TextChannel = client.channels.cache.get(
			process.env.twitchNotificationsChannel
		)
		let notificationMessageContent = `<@&814796307402457148> ${messages.getHappyMessage()} ${data.display_name
			} is live streaming!`
		let time = new Date()
		let embed = {
			"title": `https://twitch.tv/${data.display_name}`,
			"url": `https://twitch.tv/${data.display_name}`,
			"color": 6570404,
			"footer": {
				"text": `Last updated at: ${time.getUTCHours()}:${time.getUTCMinutes()} UTC`
			},
			"author": {
				"name": `${data.display_name} is streaming!`
			},
			"fields": [
				{
					"name": "Playing",
					"value": data.game_name,
					"inline": true
				},
				{
					"name": "Started at (UTC)",
					"value": data.started_at,
					"inline": true
				}
			]
		}
		if (!notificationChannel) return
		let LiveTime = await getKey(guildId, 'LiveTime')
		if (LiveTime == data.started_at) {
			// Checks if we have already notified for this live
			let LiveTitle = await getKey(guildId, 'LiveTitle')
			if (!LiveTitle) {
				setKey(guildId, 'LiveTitle', sha1(data.title))
			}
			// NOTE: hash because we don't want the title to contain SQL escaping characters
			if (sha1(data.title) == LiveTitle) {
				// If the title in the message and title of stream is the same, do nothing
				return
			} else {
				// If not
				if (process.env.NODE_ENV !== 'production')
					console.log('Title has changed, updating')
				setKey(guildId, 'LiveTitle', sha1(data.title)) // Put the new title in the db
				let MessageId = await getKey(guildId, 'LiveMessageId') // Get the message id of the notiication we sent
				if (MessageId) {
					let messageToUpdate = await notificationChannel.messages.fetch(
						MessageId
					) // Get the message object
					await messageToUpdate.edit({ content: notificationMessageContent, embed: embed }) // Edit the notification message with the new title
				}
			}
		} else {
			// We haven't notified for this live
			setKey(guildId, 'LiveTime', data.started_at) // Put the time of live in db so we don't notify twice
			const sentMessage = await notificationChannel.send(
				{ content: notificationMessageContent, embed: embed }
			) // Notify for the live in the right channel
			if (sentMessage.channel.type == 'news') {
				sentMessage.crosspost()
			}
			setKey(guildId, 'LiveMessageId', sentMessage.id) // Put the notification message id in db so we can edit the message later
		}
	}
}

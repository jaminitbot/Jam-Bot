import { client } from '../customDefinitions'
import fetch from 'node-fetch'
import {MessageEmbed, TextChannel} from 'discord.js'
import { getKey, setKey } from '../functions/db'
const messages = require('../functions/messages')
import sha1 = require('sha1');

export default async function execute(client: client) {
	if (!process.env.twitchNotificationsChannel || !process.env.twitchNotificationsUsername) return
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
	if (liveInfo.is_live) { // Checks if broadcaster is live
		client.logger.debug('Twitch channel is live')
		//@ts-expect-error
		const notificationChannel:TextChannel = await client.channels.fetch(process.env.twitchNotificationsChannel)
		if (!notificationChannel || !(notificationChannel.type == 'text' || notificationChannel.type == 'news')) return
		const guildId = notificationChannel.guild.id
		const notificationMessageContent = process.env.twitchNotificationsRoleId ? `<@&${process.env.twitchNotificationsRoleId}>` : null
		const liveTitle = liveInfo.title ?? 'N/A'
		const startedAt = liveInfo.started_at
		const playingGame = liveInfo.game_name ?? 'N/A'
		const embed = new MessageEmbed
		const newLiveIdentifier = sha1(liveTitle + playingGame) // NOTE: hash because we don't want the title to contain SQL escaping characters
		embed.setTitle(`${messages.getHappyMessage()} ${liveInfo.display_name} is live streaming!`)
		embed.setURL('https://twitch.tv/' + process.env.twitchNotificationsUsername)
		embed.setDescription(liveTitle)
		embed.addField('Playing', playingGame, true)
		embed.addField('Started at (UTC)', startedAt, true)
		embed.setFooter(`Last updated <t:${Date.now() / 1000}:R>`)
		embed.setColor('#A077FF')
		const LiveTime = await getKey(guildId, 'LiveTime')
		if (LiveTime != startedAt) {
			client.logger.info('Twitch channel is now live, and we haven\'t notified yet. Notifying now...')
			// We haven't notified for this live
			await setKey(guildId, 'LiveTime', startedAt) // Put the time of live in db so we don't notify twice
			const sentMessage = await notificationChannel.send({ content: notificationMessageContent, embed: embed }) // Notify for the live in the right channel
			if (sentMessage.channel.type == 'news') await sentMessage.crosspost()
			await setKey(guildId, 'LiveMessageId', sentMessage.id) // Put the notification message id in db so we can edit the message later
			await setKey(guildId, 'LiveIdentifier', newLiveIdentifier) // Put the title into the db
		} else {
			// We've already notified for this live
			const savedLiveIdentifier = await getKey(guildId, 'LiveIdentifier')
			if (!savedLiveIdentifier) {
				await setKey(guildId, 'LiveIdentifier', newLiveIdentifier)
			}
			if (newLiveIdentifier == savedLiveIdentifier) {
				// If the title in the message and title of stream is the same, do nothing
				return
			} else {
				// If not
				await setKey(guildId, 'LiveIdentifier', newLiveIdentifier) // Put the new title in the db
				const MessageId = await getKey(guildId, 'LiveMessageId') // Get the message id of the notification we sent
				if (MessageId) {
					const messageToUpdate = await notificationChannel.messages.fetch(MessageId) // Get the message object
					await messageToUpdate.edit({ content: notificationMessageContent, embed: embed }) // Edit the notification message with the new title
				}
			}
		}
	}
}

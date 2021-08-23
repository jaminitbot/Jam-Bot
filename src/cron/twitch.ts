// @ts-nocheck
import { BotClient } from '../customDefinitions'
import fetch from 'node-fetch'
import { MessageEmbed, TextChannel } from 'discord.js'
import { getKey, setKey } from '../functions/db'
import isImageUrl = require('is-image-url')
const messages = require('../functions/messages')
import sha1 = require('sha1')
import dayjs = require('dayjs')
export default async function execute(client: BotClient) {
	if (!process.env.twitchNotificationsChannel || !process.env.twitchNotificationsUsername) return
	let response
	try {
		response = await fetch(
			'https://api.twitch.tv/helix/streams?user_id=' +
			process.env.twitchNotificationsUsername,
			{
				headers: {
					'CLIENT-ID': process.env.twitchApiClientId,
					Authorization: 'Bearer ' + process.env.twitchApiSecret,
				},
			}
		)
	} catch (err) {
		client.logger.error('twitchNotificiations: failed fetching twich information with error: ' + err)
		return
	}
	const json = await response.json()
	const liveInfo = json.data[0]
	if (liveInfo) { // Checks if broadcaster is live
		client.logger.debug('twitch: Twitch channel is live')
		//@ts-expect-error
		const notificationChannel: TextChannel = await client.channels.fetch(process.env.twitchNotificationsChannel)
		if (!notificationChannel || !(notificationChannel.type == 'GUILD_TEXT' || notificationChannel.type == 'GUILD_NEWS')) return
		const guildId = notificationChannel.guild.id
		const notificationMessageContent = process.env.twitchNotificationsRoleId ? `<@&${process.env.twitchNotificationsRoleId}>` : null
		const liveTitle = liveInfo.title ?? 'N/A'
		const startedAt = dayjs(liveInfo.started_at).unix()
		const gameId = liveInfo.game_id
		const playingGame = liveInfo.game_name ?? 'N/A'
		const thumbnailUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${liveInfo.user_login}-200x100.jpg`
		const embed = new MessageEmbed
		embed.setTitle(`${messages.getHappyMessage()} ${liveInfo.user_login} is live streaming!`)
		embed.setURL('https://twitch.tv/' + liveInfo.user_login)
		embed.setDescription(liveTitle)
		embed.addField('Playing', playingGame, true)
		embed.addField('Started', `<t:${startedAt}:R>`, true)
		if (isImageUrl(thumbnailUrl)) embed.setImage(thumbnailUrl)
		embed.setFooter('Updates every 5 seconds.')
		embed.setColor('#A077FF')
		const newLiveIdentifier = sha1(liveTitle + playingGame) // NOTE: hash because we don't want the title to contain SQL escaping characters
		const LiveTime = await getKey(guildId, 'LiveTime')
		if (LiveTime != startedAt) {
			client.logger.info('twitch: Twitch channel is now live, and we haven\'t notified yet. Notifying now...')
			// We haven't notified for this live
			await setKey(guildId, 'LiveTime', startedAt) // Put the time of live in db so we don't notify twice
			const sentMessage = await notificationChannel.send({ content: notificationMessageContent, embeds: [embed] }) // Notify for the live in the right channel
			if (sentMessage.channel.type == 'GUILD_NEWS') await sentMessage.crosspost()
			await setKey(guildId, 'LiveMessageId', sentMessage.id) // Put the notification message id in db so we can edit the message later
			await setKey(guildId, 'LiveIdentifier', newLiveIdentifier) // Put the title into the db
		} else {
			// We've already notified for this live
			const savedLiveIdentifier = await getKey(guildId, 'LiveIdentifier')
			if (newLiveIdentifier == savedLiveIdentifier) {
				// If the title in the message and title of stream is the same, do nothing
				return
			} else {
				// If not
				await setKey(guildId, 'LiveIdentifier', newLiveIdentifier) // Put the new title in the db
				const MessageId = await getKey(guildId, 'LiveMessageId') // Get the message id of the notification we sent
				if (MessageId) {
					const messageToUpdate = await notificationChannel.messages.fetch(MessageId) // Get the message object
					await messageToUpdate.edit({ content: notificationMessageContent, embeds: [embed] }) // Edit the notification message with the new title
				}
			}
		}
	}
}

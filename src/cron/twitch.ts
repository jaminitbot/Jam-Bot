const fetch = require('node-fetch')
const messages = require('../functions/messages')
const sha1 = require('sha1')
const message = require('../events/message')
export {}
module.exports = {
    async execute(client, db, logger) {
        if (!process.env.twitchApiClientId || !process.env.twitchApiSecret)
            return
        if (
            !process.env.twitchNotificationsChannel ||
            !process.env.twitchNotificationsGuild
        )
            return
        if (process.env.NODE_ENV !== 'production')
            console.log('Checking if Twitch channel is live')
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
        const data = json.data[0]
        let fakeGuild = {}
        fakeGuild.id = process.env.twitchNotificationsGuild
        if (data.is_live) {
            // Checks if broadcaster is live
            if (process.env.NODE_ENV !== 'production')
                console.log('Twitch channel is live')
            const notificationChannel = client.channels.cache.get(
                process.env.twitchNotificationsChannel
            )
            let notificationMessageContent = `<@&814796307402457148> ${messages.getHappyMessage()} ${
                data.display_name
            } is live streaming: ${data.title}\n<https://www.twitch.tv/${
                data.broadcaster_login
            }>`
            if (!notificationChannel) return
            let LiveTime = await db.get(fakeGuild, 'LiveTime')
            if (LiveTime == data.started_at) {
                // Checks if we have already notified for this live
                let LiveTitle = await db.get(fakeGuild, 'LiveTitle')
                if (!LiveTitle) {
                    db.updateKey(fakeGuild, 'LiveTitle', sha1(data.title))
                }
                // NOTE: hash because we don't want the title to contain SQL escaping characters
                if (sha1(data.title) == LiveTitle) {
                    // If the title in the message and title of stream is the same, do nothing
                    return
                } else {
                    // If not
                    if (process.env.NODE_ENV !== 'production')
                        console.log('Title has changed, updating')
                    db.updateKey(fakeGuild, 'LiveTitle', sha1(data.title)) // Put the new title in the db
                    let MessageId = await db.get(fakeGuild, 'LiveMessageId') // Get the message id of the notiication we sent
                    if (MessageId) {
                        let messageToUpdate = await notificationChannel.messages.fetch(
                            MessageId
                        ) // Get the message object
                        await messageToUpdate.edit(notificationMessageContent) // Edit the notification message with the new title
                    }
                }
            } else {
                // We haven't notified for this live
                db.updateKey(fakeGuild, 'LiveTime', data.started_at) // Put the time of live in db so we don't notify twice
                const sentMessage = await notificationChannel.send(
                    notificationMessageContent
                ) // Notify for the live in the right channel
                if (
                    (sentMessage.channel.type == sentMessage.crosspost()) ==
                    'news'
                )
                    sentMessage.crosspost()
                db.updateKey(fakeGuild, 'LiveMessageId', sentMessage.id) // Put the notification message id in db so we can edit the message later
            }
        }
    },
}

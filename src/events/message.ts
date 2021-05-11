const permissions = require('../functions/permission')
const messages = require('../functions/messages')
const bannedIds = ['']
module.exports = {
    async register(client, message, db, logger) {
        if (message.author.bot) return
        if (message.channel.type === 'dm') {
            let embed = {
                description: message.content,
                color: '#20BE9D',
                author: {
                    name: message.author.tag,
                    icon_url:
                        message.author.avatarURL() ||
                        message.author.defaultAvatarURL,
                },
            }
            client.channels.cache
                .get(process.env.DmChannel)
                .send({ embed: embed })
            return
        }
        if (bannedIds.includes(message.author.id)) return
        const guild = message.guild
        let prefix = await db.get(guild, 'prefix')
        if (!prefix) prefix = process.env.DEFAULTPREFIX
        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const command = args.shift().toLowerCase()
        if (message.content.startsWith(prefix)) {
            if (!client.commands.has(command)) return // Doesn't have specified command
            try {
                if (client.commands.get(command).permissions) {
                    if (
                        !permissions.checkperm(
                            message.member,
                            client.commands.get(command).permissions
                        )
                    ) {
                        // User doesn't have specified permissions to run command
                        message.react('❌')
                        return message.channel.send(
                            messages.getInvalidPermissionsMessage()
                        )
                    }
                }
                client.commands
                    .get(command)
                    .execute(client, message, args, db, logger)
            } catch (error) {
                // Error running command
                logger.error('Command failed with error: ' + error)
                message.reply(messages.getErrorMessage())
            }
        }
    },
}
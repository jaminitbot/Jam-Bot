module.exports = {
    name: 'invite',
    description: 'Generates an invite URL for the current channel',
    usage: 'invite',
    execute(client, message, args, db, logger) {
        message.channel
            .createInvite({ maxAge: 0 })
            .then((invite) => message.reply('Invite link: ' + invite.url))
            .catch(logger.error)
    },
}
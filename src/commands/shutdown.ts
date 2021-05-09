const { MessageReaction } = require('discord.js')
const messages = require('../functions/messages')
module.exports = {
    name: 'shutdown',
    description: 'Gracefully shuts down the bot',
    usage: 'shutdown',
    async execute(client, message, args, db, logger) {
        if (message.author.id == process.env.OWNERID) {
            await message.react('👋')
            await message.channel.send('Shutting Down...')
            process.emit('SIGINT')
        } else {
            message.react('❌')
            message.channel.send(messages.getInvalidPermissionsMessage())
        }
    },
}

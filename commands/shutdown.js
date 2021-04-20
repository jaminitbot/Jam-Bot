const { MessageReaction } = require('discord.js')
const config = require('../config.json')
const messages = require('../functions/messages')
module.exports = {
    name: 'shutdown',
    description: 'Gracefully shuts down the bot',
    usage: 'shutdown',
    async execute(client, message, args, db, logger) {
        if (config.settings.ownerid == message.author.id) {
            await message.react('👋')
            await message.channel.send('Shutting Down...')
            process.emit('SIGINT')
        } else {
            message.react('❌')
            message.channel.send(messages.getInvalidPermissionsMessage())
        }
    },
}

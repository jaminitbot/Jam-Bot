const database = require('../../functions/db')
module.exports = {
  name: 'suggestions',
  description: 'Sets the channel for suggestions',
  usage: 'settings suggestions #suggestions',
  execute (client, message, args, db, logger) {
    const channelInput = args[1].slice(2, -1)
    if (!channelInput) return message.channel.send('You need to specify a channel!\n' + this.usage)
    const channel = message.guild.channels.cache.get(channelInput)
    if (!channel) return message.channel.send('Not a valid channel!')
    database.updateKey(db, message.guild, 'suggestionChannel', channel.id)
    message.channel.send('Set suggestion channel!')
    channel.send('Suggestions will be sent here!')
  }
}

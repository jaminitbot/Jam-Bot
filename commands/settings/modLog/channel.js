const updateKey = require('../../../functions/updateKey')
module.exports = {
  name: 'channel',
  description: 'Sets the modlog channel',
  usage: 'settings modlog channel #modlog',
  execute (client, message, args, db) {
    const channelInput = args[2].slice(2, -1)
    if (!channelInput) return message.channel.send('You need to specify a channel!\n' + this.usage)
    const channel = client.channels.cache.get(channelInput)
    if (!channel) return message.channel.send('Not a valid channel!')
    updateKey.execute(db, message.guild, 'modLogChannel', channel)
    message.channel.send('Set modlog channel!')
    channel.send('Modlogs will be sent here!')
  }
}

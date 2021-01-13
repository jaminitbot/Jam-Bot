module.exports = {
  name: 'suggest',
  description: 'Suggests sommat',
  usage: 'suggest Make a memes channel',
  execute (client, message, args, db) {
    if (!args[0]) return message.reply('Usage: ' + this.usage)
    db.get('SELECT "value" FROM "' + message.guild + '" WHERE key="suggestionChannel"', (err, row) => { // Get channel
      if (!row) return message.channel.send('Looks like suggestions haven\'t been setup here yet!')
      channelid = row.value
      const channel = client.channels.cache.get(channelid)
      const suggestion = args.splice(1).join(' ')
      if (!channel) return message.channel.send('Error finding suggestions channel, perhaps it\'s being deleted')
      const embed = {
        title: 'Suggestion by ' + message.author.tag,
        description: suggestion,
        color: 65511,
        thumbnail: {
          url: message.author.displayAvatarURL()
        }
      }
      const suggestmessage = channel.send({ embed: embed })
      suggestmessage.then((message) => {
        message.react('✅')
          .then(() => (message.react('❌')))
      })
      message.reply('Suggestion logged!')
      message.delete()
    })
  }
}

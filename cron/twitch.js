const fetch = require('node-fetch')
const updateKey = require('../functions/updateKey')
module.exports = {
  async execute (client, db, config) {
    if (!config.settings.twitchApiClientId || !config.settings.twitchApiSecret) return
    const response = await fetch('https://api.twitch.tv/helix/search/channels?query=honkserini', {
      headers: {
        'CLIENT-ID': config.settings.twitchApiClientId,
        Authorization: 'Bearer ' + config.settings.twitchApiSecret
      }
    })

    const json = await response.json()
    const data = json.data[0]
    if (data.is_live) {
      db.get('SELECT "value" FROM "' + '779060204528074783' + '" WHERE key="LiveTime"', (err, row) => {
        if (err) return
        const notificationChannel = client.channels.cache.get('780071463473643550')
        if (!notificationChannel) return
        if (row) if (row.value == data.started_at) return // Stops us notifying more than once for one live
        updateKey.execute(db, '779060204528074783', 'LiveTime', data.started_at)
        notificationChannel.send(`@everyone ${data.display_name} is live streaming: ${data.title}\nhttps://twich.tv/honkserini`)
      })
    }
  }
}

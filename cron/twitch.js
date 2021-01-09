// TODO: Make this a flag since everyone doesn't need it
const fetch = require('node-fetch')
const updateKey = require('../functions/updateKey')
module.exports = {
    async execute(client, db, config){
        const response = await fetch('https://api.twitch.tv/helix/search/channels?query=honkserini', {
            headers: {
                'CLIENT-ID': config.settings.twitchApiClientId,
                'Authorization': 'Bearer ' + config.settings.twitchApiSecret
            }
        })
        
        const json = await response.json()
        const data = json.data[0]
        if (data.is_live){
            db.get('SELECT "value" FROM "' + '779060204528074783' + '" WHERE key="LiveTime"', (err, row) => {
                if (err) return
                const channel = client.channels.cache.get('780071463473643550')
                if (!channel) return
                if (row) if (row.value == data.started_at) return // Stops us notifying more than once for one live
                updateKey.execute(db, '779060204528074783', 'LiveTime', data.started_at)
                channel.send(`@everyone ${data.display_name} is live streaming: ${data.title}\nhttps://twich.tv/honkserini`)
            })
        }
    }
}
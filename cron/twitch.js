// https://api.twitch.tv/helix/streams?user_login=' + streamer.name
const fetch = require('node-fetch')
const config = require('../config.json')
const updateKey = require('../functions/updateKey')
module.exports = {
    async execute(client, db){
        const response = await fetch('https://api.twitch.tv/helix/search/channels?query=honkserini', {
            headers: {
                'CLIENT-ID': config.settings.twitchApiClientId,
                'Authorization': 'Bearer ' + config.settings.twitchApiSecret
            }
        })
        
        const json = await response.json()
        console.log(json)
        const data = json.data[0]
        if (data.is_live){
            db.get('SELECT "value" FROM "' + '779060204528074783' + '" WHERE key="LiveTime"', (err, row) => {
                if (err) return
                const channel = client.channels.cache.get('780071463473643550')
                if (!channel) return
                if (row) if (row.value == data.started_at) return
                updateKey.execute(db, '779060204528074783', 'LiveTime', data.started_at)
                channel.send('@everyone Honk is live streaming: ' + data.title + '\nhttps://twich.tv/honkserini')
            })
        }
    }
}
module.exports = {
    register(client, msg, db){
        if (msg.author.bot) return
        db.get('SELECT "value" FROM "' + msg.guild + '" WHERE key="logDeletedMessages"', (err, row) => {
            if (err) return
            if (!row) return
            if (row.value == "on"){
                db.get('SELECT "value" FROM "' + msg.guild + '" WHERE key="modLogChannel"', (err, row) => {
                    if (err) return
                    if (!row) return
                    const modLogChannel = client.channels.cache.get(row.value)
                    if (!modLogChannel) return
                    let embed = {
                        "title": "Message deleted",
                        "description": `Message deleted in ${msg.channel} by ${msg.author}:\n${msg.content}`
                    }
                    modLogChannel.send({embed: embed})
                })
            }
        })
    }
}
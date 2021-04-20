const config = require('../config.json')

module.exports = {
    async register(client, message, db) {
        if (message.author.bot) return
        if (message.author.id == config.settings.ownerid) return
        let logDeletes = await db.get(message.guild, 'logDeletedMessages')
        if (logDeletes) {
            let modLogChannnel = await db.get(message.guild, 'modLogChannel')
            if (!modLogChannnel) return
            modLogChannnel = await client.channels.cache.get(modLogChannnel)
            if (!modLogChannnel) return
            let embed = {
                title: 'Message deleted',
                description: `Message deleted in ${message.channel} by ${
                    message.author
                }:\n\`\`\`${message.content || 'NULL'}\`\`\``,
                color: ' #FF0000',
                timestamp: Date.now(),
            }
            modLogChannnel.send({ embed: embed })
        }
    },
}

const guildEvent = require('../events/guildCreate')
const config = require('../config.json')
module.exports = {
    name: 'guild',
    description: 'Gets guild info',
    usage: '',
    execute(client, message, args, db, logger) {
        if (config.settings.ownerid == message.author.id) {
            if (!args[0]) return message.reply('you need to specify a guild id')
            message.channel.send({
                embed: guildEvent.generateGuildInfoEmbed(
                    client.guilds.cache.get(args[0])
                ),
            })
        }
    },
}

const guildEvent = require('../events/guildCreate')
module.exports = {
    name: 'guild',
    description: 'Gets guild info',
    usage: '',
    execute(client, message, args, db, logger) {
        if (message.author.id == process.env.OWNERID) {
            if (!args[0]) return message.reply('you need to specify a guild id')
            message.channel.send({
                embed: guildEvent.generateGuildInfoEmbed(
                    client.guilds.cache.get(args[0])
                ),
            })
        }
    },
}

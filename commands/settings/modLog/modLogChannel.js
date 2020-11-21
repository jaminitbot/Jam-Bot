module.exports = {
    execute(client, message, args, db,) {
        const channelInput = args[2].slice(2, -1)
        if (!channelInput) return message.channel.send('You need to specify a channel!')
        const channel = client.channels.cache.get(channelInput)
        if (!channel) return message.channel.send('Not a valid channel!')
        db.run('UPDATE "' + message.guild.id + '" SET \'value\' = \'' + channel.id + '\' WHERE key=\'modLogChannel\'', (err) => {
            if(err) return console.error(err.message)
            message.channel.send('Set modlog channel!')
            channel.send('Modlogs will be sent here!')
        })
    }
}
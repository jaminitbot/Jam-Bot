module.exports = {
    name: 'prefix',
    description: 'Sets the bot prefix',
    usage: 'settings prefix $',
    execute(client, message, args, db, logger) {
        const prefix = args[1]
        if (!prefix)
            return message.channel.send(
                'You need to specify a prefix!\n' + this.usage
            )
        db.updateKey(message.guild, 'prefix', prefix)
        message.channel.send("Updated prefix to '" + prefix + "'")
    },
}

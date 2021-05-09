module.exports = {
    name: 'getkey',
    description: 'Gets a db key',
    usage: 'getkey blah',
    async execute(client, message, args, db, logger) {
        if (!(message.author.id == process.env.OWNERID)) return
        if (!args[0]) return message.reply('You need to specify a key to get')
        message.channel.send((await db.get(message.guild, args[0])) || 'null')
    },
}

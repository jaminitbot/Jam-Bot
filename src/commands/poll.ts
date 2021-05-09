const delay = require('delay')
module.exports = {
    name: 'poll',
    description: 'Creates a poll',
    usage: 'poll Are chips good?',
    async execute(client, message, args, db, logger) {
        if (!args[0])
            return message.reply(
                'you need to specify what to make the poll about!'
            )
        message.delete()
        const text = args.splice(0).join(' ')
        let embed = {
            description: text,
            footer: {
                text: `A poll by ${message.author.tag}`,
                icon_url: message.member.user.avatarURL(),
            },
            timestamp: Date.now(),
        }
        const sent = await message.channel.send({ embed: embed })
        await sent.react('✅')
        await delay(1100)
        sent.react('❌')
    },
}

module.exports = {
    name: 'unban',
    description: 'Unbans a member',
    permissions: ['BAN_MEMBERS'],
    usage: 'unban @test',
    async execute(client, message, args, db, logger) {
        if (!message.guild.me.hasPermission(['BAN_MEMBERS', 'KICK_MEMBERS']))
            return message.channel.send(
                `I don't have permission to perform this command, check I can KICK/BAN people!`
            )
        const memberToUnBan =
            message.mentions.members.first() ||
            (await message.guild.members.cache.get(args[0]))
        if (!memberToUnBan) {
            return message.reply("that ain't a valid user!")
        }
        const banList = await message.guild.fetchBans()
        const bannedUser = banList.find((user) => user.id === memberToUnBan.id)
        if (!bannedUser)
            return message.channel.send(
                `${memberToUnBan.user.tag} was never banned!`
            )
        const reason = args.splice(1).join(' ')
        const moderator =
            message.author.username + '#' + message.author.discriminator
        memberToUnBan
            .unban({ reason: `${moderator}: ${reason}` })
            .then((member) => {
                message.channel.send(`${member.user.tag} was unbanned!`)
            })
            .catch(() => {
                return message.channel.send(`Oops, something went wrong!`)
            })
    },
}

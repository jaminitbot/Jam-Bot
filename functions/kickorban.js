module.exports = {
    execute(message, args, banOrMute){
        if (!args[0]) return message.reply('Usage: ' + this.usage)
		if(!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR', 'KICK_MEMBERS'])) return message.channel.send(`I don't have permission to perform this command, check I can ${banOrMute} people!`)
		const memberToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (!memberToBan) return message.reply('You didn\'t mention a valid user in this server!')
		if (message.author.id == memberToBan.id) return message.reply(`You can't ${banOrMute} yourself silly!`)
		const moderator = message.author.username + '#' + message.author.discriminator
        let reason = args.splice(1).join(' ')
        sucessful = true
        if (banOrMute == 'ban'){
            memberToBan.ban(`${moderator}: ${reason}`, 1)
                .catch(sucessful = false)
        } else {
            memberToBan.kick(`${moderator}: ${reason}`)
                .catch(sucessful = false)
        }
        if (sucessful) {
            message.reply(`${memberToBan} was ${banOrMute}ed with reason: ${reason}`)
        } else {
            message.channel.send('It may have worked, it may have not')
        }
    }
}

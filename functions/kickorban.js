module.exports = {
    execute(message, args, banOrMute){
        if (!args[0]) return message.reply('Usage: ' + this.usage)
		if(!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR', 'KICK_MEMBERS'])) return message.channel.send(`I don't have permission to perform this command, check I can ${banOrMute} people!`)
		const memberToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (!memberToBan) return message.reply('You didn\'t mention a valid user in this server!')
		if (message.author.id == memberToBan.id) return message.reply(`You can't ${banOrMute} yourself silly!`)
		const moderator = message.author.username + "#" + message.author.discriminator
		let reason = args.splice(1).join(' ')
        if (banOrMute == 'ban'){
            memberToBan.ban(`${moderator}: ${reason}`, 1)
                .then(message.reply(`${memberToBan} was ${banOrMute}ed with reason: ${reason}`))
                .catch(message.reply('You can\'t kick someone with a higher role than me'))
        } else {
            memberToBan.kick(`${moderator}: ${reason}`)
                .then(message.reply(`${memberToBan} was ${banOrMute}ed with reason: ${reason}`))
                .catch(message.reply('You can\'t kick someone with a higher role than me'))
        }
    }
}
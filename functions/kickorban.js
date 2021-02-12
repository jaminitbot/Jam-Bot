module.exports = {
	execute(message, args, kickOrBan) {
		if (!args[0]) return message.reply(`usage: ${kickOrBan} @person reason`)
		if (!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR', 'KICK_MEMBERS'])) return message.channel.send(`I don't have permission to perform this command, check I can ${kickOrBan} people!`)
		const memberToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (memberToBan.id == '685199695228043371') return message.channel.send('Ha no, no kick kick')
		if (!memberToBan) return message.reply('You didn\'t mention a valid user in this server!')
		if (message.author.id == memberToBan.id) return message.reply(`You can't ${kickOrBan} yourself silly!`)
		const moderator = message.author.username + '#' + message.author.discriminator
		const reason = args.splice(1).join(' ')
		sucessful = true
		if (kickOrBan == 'ban') {
			memberToBan.ban({ reason: `${moderator}: ${reason}`, days: 1 })
				.catch(sucessful = false)
		} else {
			memberToBan.kick({ reason: `${moderator}: ${reason}`, days: 1 })
				.catch(sucessful = false)
		}
		if (sucessful) {
			message.reply(`${memberToBan} was ${kickOrBan}ed with reason: ${reason}`)
		} else {
			message.channel.send('It may have worked, it may have not')
		}
	}
}

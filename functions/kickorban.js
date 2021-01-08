module.exports = {
    execute(message, args, type){
        if (!args[0]) return message.reply('Usage: ' + this.usage)
		if(!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR', 'KICK_MEMBERS'])) return message.channel.send(`I don't have permission to perform this command, check I can ${type} people!`)
		const memberToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (!memberToBan) return message.reply('You didn\'t mention a valid user in this guild!') // Prolly should be more descriptive to user
		if (message.author.id == memberToBan.id) return message.reply(`You can't ${type} yourself silly!`)
		const userName = message.author.username + "#" + message.author.discriminator
		let reason = args.splice(1).join(' ')
        if (type == 'ban'){
            memberToBan.ban({reason: `${userName}: ${reason}`, days: 1})
        } else {
            memberToBan.kick({reason: `${userName}: ${reason}`})
        }
		
		message.reply(`${memberToBan} was ${type}ed with reason: ${reason}`)
    }
}

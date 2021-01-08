module.exports = {
    execute(message, args, type){
        if (!args[0]) return message.reply('Usage: ' + this.usage)
		if(!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send(`I don\'t have permission to perform this command, check I can ${type} people!`)
		const memberToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (!memberToBan) return message.reply('You didn\'t mention a valid user in this guild!') // Prolly should be more descriptive to user
		if (message.author.id == memberToBan.id) return message.reply(`You can\'t ${type} yourself silly!`)
		const userName = message.author.username + "#" + message.author.discriminator
		let reason = `${args.splice(1).join(' ')}`
		const authorRole = message.member.roles.highest
		const targetRole = memberToBan.roles.highest
		
		if (!message.member.hasPermission(['ADMINISTRATOR'])){ // Admins without a role need to be able to overide dis
			if (!authorRole.comparePositionTo(targetRole) <= 0) return message.reply(`You can\'t ${type} them, their role is higher than yours.`) // Doesn't allow a user to ban someone whose role is higher than theres https://stackoverflow.com/questions/64056025/discord-js-ban-user-permissions-command
        }
        if (type == 'ban'){
            message.guild.member(memberToBan).ban(memberToBan, {reason: `${userName}: ${reason}`, days: 1})
        } else {
            message.guild.member(memberToBan).kick(memberToBan)
        }
		
		message.reply(`${memberToBan} was ${type}ed with reason: \`${reason}\``)
    }
}

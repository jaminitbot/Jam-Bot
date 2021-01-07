module.exports = {
	name: 'ban',
	description: 'Bans a member',
	permissions: ['BAN_MEMBERS'],
	usage: 'ban @user',
	execute(client, message, args, db) {
		message.reply('No, its faulty')
		// if (!args[0]) return message.reply('Usage: ' + this.usage)
		// if(!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('I don\'t have permission to perform this command, check I can ban people!')
		// const memberToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		// if (!memberToBan) return message.reply('You didn\'t mention a valid user in this guild!') // Prolly should be more descriptive to user
		// if (message.author.id == memberToBan.id) return message.reply('You can\'t ban yourself silly!')
		// if ((args.splice(1).join(' ') == ' ') || !args) return message.reply('You need to specify a reason!')
		// const userName = message.author.username + "#" + message.author.discriminator
		// let reason = `${args.splice(1).join(' ')}`
		// const authorRole = message.member.roles.highest
		// const targetRole = memberToBan.roles.highest
		
		// if (!message.member.hasPermission(['ADMINISTRATOR'])){ // Admins without a role need to be able to overide dis
		// 	if (!targetRole.comparePositionTo(authorRole) <= 0) return message.reply('You can\'t kick them, their role is higher than yours.') // Doesn't allow a user to ban someone whose role is higher than theres https://stackoverflow.com/questions/64056025/discord-js-ban-user-permissions-command
		// }
		// message.guild.member(memberToBan).ban(memberToBan, {reason: `${userName}: ${reason}`, days: 1})
		// message.reply(`${memberToBan} was banned with reason: \`${reason}\``)
	},
}
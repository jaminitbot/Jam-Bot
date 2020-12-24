module.exports = {
	name: 'ban',
	description: 'Bans a member',
	permissions: 'BAN_MEMBERS',
	usage: 'ban @user',
	execute(client, message, args, db) {
		if(!message.member.hasPermission(['BAN_MEMBERS'])) return message.reply('You do not have permission to perform this command!')
		if(!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('I don\'t have permission to perform this command, check I can ban people!')
		const memberToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (!memberToBan) return message.reply('You didn\'t mention a valid user in this guild!') // Prolly should be more descriptive to user
		if (message.author.id == memberToBan.id) return message.reply('You can\'t ban yourself silly!')
		let reason = args.splice(1).join(' ')
		const authorRole = message.member.roles.highest
		const targetRole = memberToBan.roles.highest
		if (!message.member.hasPermission(['ADMINISTRATOR'])){ // Admins without a role need to be able to overide dis
			if (!targetRole.comparePositionTo(authorRole) <= 0) return message.reply('You can\'t kick them, their role is higher than yours.') // Doesn't allow a user to ban someone whose role is higher than theres https://stackoverflow.com/questions/64056025/discord-js-ban-user-permissions-command
		}
		message.guild.member(memberToBan).ban(memberToBan, {reason: reason, days: 1})
		message.reply(`${memberToBan} has been banned.`)
	},
}
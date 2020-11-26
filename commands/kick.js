module.exports = {
	name: 'kick',
	description: 'Kicks a user',
	execute(client, message, args, db) {
		if(!message.member.hasPermission(['KICK_MEMBERS'])) return message.reply('You do not have permission to perform this command!') // Checks if the user can kick
		if(!message.guild.me.hasPermission(['KICK_MEMBERS'])) return message.channel.send('I dont have permission to perform this command, try inviting me again!') // Checks if bot can kick
		const memberToKick = message.mentions.members.first() || message.guild.members.cache.get(args[0]) // Gets the mentioned user
		if (!memberToKick) return message.reply('You didn\'t mention a valid user')
		if (message.author.id == memberToKick.id) return message.reply('You can\'t kick yourself!') // Checks if the user mentioned themself
		let reason = args.splice(1).join(' ')
		const authorRole = message.member.roles.highest
		const targetRole = memberToKick.roles.highest
		if (!message.member.hasPermission(['ADMINISTRATOR'])){ // Admins without a role need to be able to overide
			if (!targetRole.comparePositionTo(authorRole) <= 0) return message.reply('You can\'t kick them, your role is lower than them!') // https://stackoverflow.com/questions/64056025/discord-js-ban-user-permissions-command
		} 
		message.guild.member(memberToKick).kick(memberToKick, {reason: reason})
		message.channel.send(`I kicked ${memberToKick}`)
	},
}
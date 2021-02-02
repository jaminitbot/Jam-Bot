const messages = require('../functions/messages')
module.exports = {
	name: 'tell',
	description: 'Tells something to someone',
	usage: '',
	execute(client, message, args, db) {
		if (message.author.id == '707313027485270067') return message.channel.send(messages.getPermissionsMessage())
		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (!user) return message.reply('you need to mention a valid person!')
		if (!args[1]) return message.reply('you need to say something to tell them')
		message.delete()
		const thingToSay = args.splice(1).join(' ')
		message.channel.send(`${thingToSay}, <@${user.id}>`)
	},
}
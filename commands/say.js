const config = require('../config.json')
module.exports = {
	name: 'say',
	description: 'Say',
	usage: 'say #general Hiiii',
	execute(client, message, args, db, logger) {
		if (!(message.author.id == config.settings.ownerid)) return
		message.delete()
		const channel = message.mentions.channels.first() || client.channel.cache.get(args[0])
		if (!channel) return message.reply('you need to specify a valid channel')
		const thingToSay = args.splice(1).join(' ')
		channel.send(thingToSay)
	},
}
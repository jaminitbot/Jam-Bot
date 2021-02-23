const config = require('../config.json')
module.exports = {
	name: 'say',
	description: 'Say',
	usage: 'say #general Hiiii',
	execute(client, message, args, db, logger) {
		if (!message.author.id == config.settings.ownerid) return
		message.channel.send(eval(args.splice(0).join(' ')))
	},
}
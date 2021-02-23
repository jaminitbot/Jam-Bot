const config = require('../config.json')
module.exports = {
	name: 'eval',
	description: 'Executes code',
	usage: 'eval 1+1',
	execute(client, message, args, db, logger) {
		if (!message.author.id == config.settings.ownerid) return
		message.channel.send(String(eval(args.splice(0).join(' '))))
	},
}
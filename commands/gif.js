const image = require('./image')
module.exports = {
	name: 'gif',
	description: 'Gets a gif',
	usage: 'gif hello',
	execute(client, message, args, db, logger) {
		if (!args[0]) return message.reply('you need to specify what to search for!')
		args.push('gif')
		image.execute(client, message, args, db, logger)
	},
}
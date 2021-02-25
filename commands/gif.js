const image = require('./image')
module.exports = {
	name: 'gif',
	description: 'Gets a gif',
	usage: 'gif hello',
	execute(client, message, args, db, logger) {
		args.push('gif')
		image.execute(client, message, args, db, logger)
	},
}
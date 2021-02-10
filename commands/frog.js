const image = require('./image')
module.exports = {
	name: 'forg',
	description: 'Frog',
	usage: 'frog',
	execute(client, message, args, db, logger) {
		let tempArgs = ['frog']
		image.execute(client, message, tempArgs, db)
	},
}
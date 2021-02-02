const image = require('./image')
module.exports = {
	name: 'frog',
	description: 'Frog',
	usage: 'frog',
	execute(client, message, args, db) {
		let tempArgs = ['frog']
		image.execute(client, message, tempArgs, db)
	},
}
const image = require('./image')
const random = require('random')
module.exports = {
	name: 'wombat',
	description: 'Wombat',
	usage: 'Wombat',
	execute(client, message, args, db, logger) {
		let tempArgs = [random.int(min=1, max=25), 'wombat'] // eslint-disable-line no-undef
		image.execute(client, message, tempArgs, db)
	},
}

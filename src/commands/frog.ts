const image = require('./image')
const random = require('random')
export { }
module.exports = {
	name: 'forg',
	description: 'Frog',
	usage: 'frog',
	execute(client, message, args, db, logger) {
		let tempArgs = [random.int(1, 25), 'frog'] // eslint-disable-line no-undef
		image.execute(client, message, tempArgs, db)
	},
}

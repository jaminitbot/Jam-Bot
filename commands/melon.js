const image = require('./image')
module.exports = {
	name: 'melon',
	description: 'Watermelon',
	usage: 'melon',
	execute(client, message, args, db, logger) {
		let tempArgs = ['watermelon']
		image.execute(client, message, tempArgs, db)
	},
}
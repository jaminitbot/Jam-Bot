const image = require('./image')
module.exports = {
	name: 'melon',
	description: 'Melon',
	usage: 'melon',
	execute(client, message, args, db) {
		let tempArgs = ['watermelon']
		image.execute(client, message, tempArgs, db)
	},
}
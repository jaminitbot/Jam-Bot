const image = require('./image')
const random = require('random')
module.exports = {
	name: 'penis',
	description: 'penis',
	usage: 'penis',
	execute(client, message, args, db, logger) {
		if (!String(message.channel.name).toLowerCase().includes('nsfw')) return 
		let search = [random.int(min=1, max=25), 'penis']
		image.execute(client, message, search, db, logger)
	},
}
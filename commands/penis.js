const image = require('./image')
module.exports = {
	name: 'penis',
	description: 'penis',
	usage: 'penis',
	execute(client, message, args, db, logger) {
		if (!String(message.channel.name).toLowerCase().includes('nsfw')) return 
		let search = ['penis']
		image.execute(client, message, search, db, logger)
	},
}
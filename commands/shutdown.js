const config = require('../config.json')
module.exports = {

	name: 'shutdown',
	description: 'STOPS THE BOT',
	usage: '!shutdown',
	execute(client, message, args, db) {
		if (config.settings.ownerid == message.author.id){
			process.exit()
		} else {
			message.channel.send('Nice try.')
		}
        
	},
};
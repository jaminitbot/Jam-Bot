const config = require('../config.json')
module.exports = {
	name: 'shutdown',
	description: 'STOPS THE BOT',
	usage: '!shutdown',
	execute(client, message, args, db) {
		if (config.settings.ownerid == message.author.id){
			return process.exit()
		} else {
			return message.channel.send('Nice try.')
		}
        
	},
};
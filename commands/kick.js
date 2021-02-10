const kickOrBan = require('../functions/kickorban')
module.exports = {
	name: 'kick',
	description: 'Kicks a user from the server',
	permissions: ['KICK_MEMBERS'],
	usage: 'kick @user',
	async execute(client, message, args, db, logger) {
		kickOrBan.execute(message, args, 'kick')
	}
}

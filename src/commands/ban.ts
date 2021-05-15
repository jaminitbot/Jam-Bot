import execute from '../functions/kickorban'
module.exports = {
	name: 'ban',
	description: 'Bans a user from the server',
	permissions: ['BAN_MEMBERS'],
	usage: 'ban @user',
	execute(client, message, args, db, logger) {
		execute(message, args, 'ban')
	},
}

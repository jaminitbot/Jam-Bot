import KickOrBan from '../functions/kickorban'
module.exports = {
	name: 'ban',
	description: 'Bans a user from the server',
	permissions: ['BAN_MEMBERS'],
	usage: 'ban @user',
	execute(client, message, args, db, logger) {
		KickOrBan(message, args, 'ban')
	},
}

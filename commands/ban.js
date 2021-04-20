const kickOrBan = require('../functions/kickorban')
module.exports = {
    name: 'ban',
    description: 'Bans a user from the server',
    permissions: ['BAN_MEMBERS'],
    usage: 'ban @user',
    execute(client, message, args, db, logger) {
        kickOrBan.execute(message, args, 'ban')
    },
}

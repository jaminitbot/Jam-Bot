const kickOrBan = require('../functions/kickorban')
module.exports = {
  name: 'ban',
  description: 'Bans a member',
  permissions: ['BAN_MEMBERS'],
  usage: 'ban @user',
  execute (client, message, args, db) {
    kickOrBan.execute(message, args, 'ban')
  }
}

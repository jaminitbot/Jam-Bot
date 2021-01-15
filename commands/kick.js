const kickOrBan = require('../functions/kickorban')
module.exports = {
  name: 'kick',
  description: 'Kicks a user',
  permissions: ['KICK_MEMBERS'],
  usage: 'kick @user',
  async execute (client, message, args, db) {
    kickOrBan.execute(message, args, 'kick')
  }
}

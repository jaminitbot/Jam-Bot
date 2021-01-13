const database = require('../../../functions/db')
module.exports = {
  name: 'logdeletes',
  description: 'Turns logging deletes on or off',
  usage: 'settings modlog logdeletes on|off',
  async execute (client, message, args, db) {
    const toggle = String(args[2]).toLowerCase()
    if (!toggle || !toggle == 'on' || !toggle == 'off') {
      return message.channel.send('You need to specify whether you want to toggle logging deletes \'on\' or \'off\'\n' + this.usage)
    }
    updateKey.execute(db, message.guild, 'logDeletedMessages', toggle)
    message.channel.send(`Turned logging deletes ${toggle}`)
  }
}

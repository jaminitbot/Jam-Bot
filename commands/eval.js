const config = require('../config.json')
const messages = require('../functions/messages')
module.exports = {
    name: 'eval',
    description: 'Executes code',
    usage: 'eval 1+1',
    async execute(client, message, args, db, logger) {
        if (message.author.id == config.settings.ownerid) {
            message.channel.send(String(await eval(args.splice(0).join(' '))))
        } else {
            message.channel.send(messages.getInvalidPermissionsMessage())
        }
    },
}

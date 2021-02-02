const permissions = require('../functions/permission')
const messages = require('../functions/messages')

module.exports = {
	async register(client, msg, db, config) {
		if (msg.author.bot) return
		const message = String(msg.content).toLowerCase()
		const guild = msg.guild
		db.get('SELECT "value" FROM "' + guild + '" WHERE key="prefix"', (err, row) => { // Get prefix
			if (err) return console.log(err)
			if (row) {
				prefix = String(row.value)
			} else { // No prefix in db, use default
				prefix = config.defaults.prefix
			}
			const args = msg.content.slice(prefix.length).trim().split(/ +/)
			const command = args.shift().toLowerCase()
			if (message.startsWith(prefix)) {
				if (!client.commands.has(command)) return // Doesn't have specified command
				try {
					if (client.commands.get(command).permissions) {
						if (!permissions.checkperm(msg.member, client.commands.get(command).permissions)) { // User doesn't have specified permissions to run command
							return msg.channel.send(messages.getPermissionsMessage())
						}
					}
					client.commands.get(command).execute(client, msg, args, db)
				} catch (error) { // Error running command
					console.error(error)
					msg.reply(messages.getErrorMessage())
				}
			}
		})
	}
}

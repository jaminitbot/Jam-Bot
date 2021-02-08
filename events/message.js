const permissions = require('../functions/permission')
const messages = require('../functions/messages')
const bannedIds = ['']
module.exports = {
	async register(client, message, db, config) {
		if (!message.guild) return
		if (message.author.bot) return
		if (bannedIds.includes(message.author.id)) return
		if (String(message.channel.name).includes('juan') && !(String(message.content) == 'juan')) message.delete()
		// if (message.author.id == '582305080200396811') message.react('💩')
		const guild = message.guild
		db.get('SELECT "value" FROM "' + guild + '" WHERE key="prefix"', (err, row) => { // Get prefix
			if (err) return console.log(err)
			if (row) {
				prefix = String(row.value)
			} else { // No prefix in db, use default
				prefix = config.defaults.prefix
			}
			const args = message.content.slice(prefix.length).trim().split(/ +/)
			const command = args.shift().toLowerCase()
			if (message.content.startsWith(prefix)) {
				if (!client.commands.has(command)) return // Doesn't have specified command
				try {
					if (client.commands.get(command).permissions) {
						if (!permissions.checkperm(message.member, client.commands.get(command).permissions)) { // User doesn't have specified permissions to run command
							message.react('❌')
							return message.channel.send(messages.getPermissionsMessage())
						}
					}
					client.commands.get(command).execute(client, message, args, db)
				} catch (error) { // Error running command
					console.error(error)
					message.reply(messages.getErrorMessage())
				}
			}
		})
	}
}

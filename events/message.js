const permissions = require('../functions/permission')
const messages = require('../functions/messages')
const rateLimit = require('rate-limiter-flexible')
const opts = {
	points: 3,
	duration: 3,
}
const rateLimiter = new rateLimit.RateLimiterMemory(opts);
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
						var consumePoints = 3 // Rate limit more for admin stuff
						if (!permissions.checkperm(msg.member, client.commands.get(command).permissions)) { // User doesn't have specified permissions to run command
							return msg.channel.send(messages.getPermissionsMessage())
						} 
					} else {
						var consumePoints = 1
					}
					rateLimiter.consume(msg.author.id, consumePoints)
						.then((rateLimiterRes) => {
							client.commands.get(command).execute(client, msg, args, db)
						})
						.catch((rateLimiterRes) => {
							msg.reply('Slow down with the commands!')
						});
					
				} catch (error) { // Error running command
					console.error(error)
					msg.reply(messages.getErrorMessage())
				}
			}
		})
	}
}

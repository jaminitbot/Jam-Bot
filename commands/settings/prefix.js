module.exports = {
	execute(client, message, args, db,) {
		let prefix = args[1]
		if (!prefix) return message.channel.send('You need to specify a prefix!')
		const updateKey = require('../../functions/updateKey')
		updateKey.execute(db, message.guild, 'prefix', prefix)
		message.channel.send('Updated prefix to \'' + prefix + '\'')
	}
}
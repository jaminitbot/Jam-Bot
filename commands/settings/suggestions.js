const updateKey = require('../../functions/updateKey')
module.exports = {
	execute(client, message, args, db,) {
		const channelInput = args[1].slice(2, -1)
		if (!channelInput) return message.channel.send('You need to specify a channel!')
		const channel = message.guild.channels.cache.get(channelInput)
		if (!channel) return message.channel.send('Not a valid channel!')
		updateKey.execute(db, message.guild, 'suggestionChannel', channel)
		message.channel.send('Set suggestion channel channel!')
		channel.send('Suggestions will be sent here!')

	}
}
module.exports = {
	name: 'channel',
	description: 'Sets the modlog channel',
	usage: 'settings modlog channel #modlog',
	execute(client, message, args, db, logger) {
		if (!args[2]) return message.channel.send('You need to specify a channel!')
		const channelInput = args[2].slice(2, -1)
		const channel = client.channels.cache.get(channelInput)
		if (!channel) return message.channel.send('Not a valid channel!')
		db.updateKey(message.guild, 'modLogChannel', channel)
		message.channel.send('Set modlog channel!')
		channel.send('Modlogs will be sent here!')
	}
}

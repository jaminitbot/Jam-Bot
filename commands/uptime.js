module.exports = {
	name: 'uptime',
	description: 'Displays the bot\'s current uptime',
	usage: 'uptime',
	execute(client, message, args, db, logger) {
		let TimeDate = new Date(Date.now() - client.uptime)
		message.channel.send('The bot has been up since: ' + TimeDate.toString())
	}
}

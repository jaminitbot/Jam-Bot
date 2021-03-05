module.exports = {
	name: 'uptime',
	description: 'Displays the bot\'s current uptime',
	usage: 'uptime',
	execute(client, message, args, db, logger) {
		date = new Date(client.uptime);
		message.channel.send('The bot has been up since: ' + date.toString())
	}
}

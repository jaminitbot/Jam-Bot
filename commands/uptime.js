function msToTime(duration) {
	const milliseconds = parseInt((duration % 1000) / 100)
	let seconds = Math.floor((duration / 1000) % 60)
	let minutes = Math.floor((duration / (1000 * 60)) % 60)
	let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
	hours = (hours < 10) ? '0' + hours : hours
	minutes = (minutes < 10) ? '0' + minutes : minutes
	seconds = (seconds < 10) ? '0' + seconds : seconds
	return hours + ':' + minutes + ':' + seconds + '.' + milliseconds
}
module.exports = {
	name: 'uptime',
	description: 'Displays the bot\'s current uptime',
	usage: 'uptime',
	execute(client, message, args, db, logger) {
		message.channel.send('The bot has been up for: ' + msToTime(client.uptime))
	}
}

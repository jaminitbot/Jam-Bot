module.exports = {
	name: 'ping',
	description: 'Latency!',
	execute(client, message, args, db) {
		message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`) // https://stackoverflow.com/a/63411714
	},
}
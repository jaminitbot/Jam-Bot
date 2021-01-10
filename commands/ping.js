module.exports = {
	name: 'ping',
	description: 'Latency!',
	usage: 'ping',
	execute(client, message, args, db) {
		message.channel.send('Pong! 🏓').then(sent => {
			sent.edit(`🏓 Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms 🏓`);
		});
	},
}
module.exports = {
	name: 'ping',
	description: 'Displays various latency information',
	usage: 'ping',
	async execute(client, message, args, db) {
		message.react('🏓')
		const sent = await message.channel.send('Pong! 🏓')
		sent.edit(`🏓 Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms 🏓`) // https://discordjs.guide/popular-topics/faq.html#how-to-check-the-bots-ping
	}
}

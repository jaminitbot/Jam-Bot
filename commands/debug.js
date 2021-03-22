module.exports = {
	name: 'debug',
	description: 'Displays debug information',
	permissions: ['ADMINISTRATOR'],
	usage: 'debug',
	async execute(client, message, args, db, logger) {
		const sent = await message.channel.send('Loading...')
		// sent.edit(`🏓 Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms 🏓`) // https://discordjs.guide/popular-topics/faq.html#how-to-check-the-bots-ping
		let TimeDate = new Date(Date.now() - client.uptime)
		let embed = {
			title: 'Debug Information',
			description: `Roundtrip: ${sent.createdTimestamp - message.createdTimestamp}ms\nAPI: ${Math.round(client.ws.ping)}ms\nRevision: ${process.env.GIT_REV}\nUptime: ${TimeDate.toString()}\nReady: ${client.readyAt}`,
			footer: {
				text: `Intiated by ${message.author.tag}`,
				icon_url: message.author.displayAvatarURL()
			},
			timestamp: Date.now()
		}
		sent.edit({content: '', embed:embed})
	},
}
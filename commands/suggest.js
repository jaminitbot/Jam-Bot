
const delay = require('delay')
module.exports = {
	name: 'suggest',
	description: 'Suggests something',
	usage: 'suggest Make a memes channel',
	async execute(client, message, args, db, logger) {
		if (!args[0]) return message.reply('You need to specify what to suggest!')
		let suggestionChannel = await db.get(message.guild, 'suggestionChannel')
		if (!suggestionChannel) return message.channel.send('Looks like suggestions haven\'t been setup here yet!')
		const channel = client.channels.cache.get(suggestionChannel)
		const suggestion = args.splice(0).join(' ')
		if (!channel) return message.channel.send('Error finding suggestions channel, perhaps it\'s being deleted')
		message.delete()
		let suggestionCount = await db.get(message.guild, 'suggestionCount')
		if (!suggestionCount) suggestionCount = 0
		suggestionCount = parseInt(suggestionCount)
		db.updateKey(message.guild, 'suggestionCount', suggestionCount + 1)
		const embed = {
			title: `Suggestion #${suggestionCount + 1}`,
			description: suggestion,
			color: 65511,
			footer: {
				text: `Suggestion by ${message.author.tag}`,
				icon_url: message.author.displayAvatarURL()
			},
			timestamp: Date.now()
		}
		const suggestmessage = await channel.send({ embed: embed })
		message.reply('Suggestion logged!')
		await suggestmessage.react('✅')
		await delay(1050)
		await suggestmessage.react('❌')
	}
}

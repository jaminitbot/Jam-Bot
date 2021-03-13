const database = require('../functions/db')
module.exports = {
	name: 'suggest',
	description: 'Suggests something',
	usage: 'suggest Make a memes channel',
	execute(client, message, args, db, logger) {
		if (!args[0]) return message.reply('You need to specify what to suggest!')
		let suggestionChannel = database.get(db, message.guild, 'suggestionChannel')
		if (!suggestionChannel) return message.channel.send('Looks like suggestions haven\'t been setup here yet!')
		const channel = client.channels.cache.get(suggestionChannel)
		const suggestion = args.splice(0).join(' ')
		if (!channel) return message.channel.send('Error finding suggestions channel, perhaps it\'s being deleted')
		message.delete()
		const embed = {
			title: 'Suggestion',
			description: suggestion,
			color: 65511,
			footer: {
				text: `Suggestion by ${message.author.tag}`,
				icon_url: message.author.displayAvatarURL()
			},
			timestamp: Date.now()
		}
		const suggestmessage = channel.send({ embed: embed })
		suggestmessage.then((message) => {
			message.react('✅')
				.then(() => (message.react('❌')))
		})
		message.reply('Suggestion logged!')
	}
}

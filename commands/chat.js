const fetch = require('node-fetch')
module.exports = {
	name: 'chat',
	description: 'Chats with the bot',
	usage: 'chat how are you',
	async execute(client, message, args, db, logger) {
		const userMessage = args.splice(0).join(' ')
		const { response } = await fetch('https://some-random-api.ml/chatbot?message=' + encodeURIComponent(userMessage)).then(response => response.json())
		message.channal.send(response)
	},
}
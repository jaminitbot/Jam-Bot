const fetch = require('node-fetch')
module.exports = {
	name: 'chat',
	description: 'Chats with the bot',
	usage: 'chat how are you',
	execute(client, message, args, db, logger) {
		const message = args.splice(0).join(' ')
		const { response } = await fetch('https://some-random-api.ml/chatbot?message=' + encodeURIComponent(message)).then(response => response.json())
		message.channal.send(response)
	},
}
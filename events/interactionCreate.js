const messageEvent = require('../events/message')
module.exports = {
	async register(client, db, config, interaction) {
		let message
		message.channel = client.channels.fetch(interaction.channel_id)
		messageEvent.register(client, db, config, )
	}
}
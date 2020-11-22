module.exports = {
	name: 'help',
	description: 'Help me',
	execute(client, message, args, db) {
        message.channel.send('You need help?')
	},
};
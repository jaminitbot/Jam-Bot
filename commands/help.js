module.exports = {
	name: 'help',
	description: 'Help me',
	execute(client, message, args, db) { // TODO: #5 Actually implement a help command
        message.channel.send('You need help?')
	},
};
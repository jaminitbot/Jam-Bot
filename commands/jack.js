module.exports = {
	name: 'jack',
	description: 'Get some opinions on jack',
	usage: 'jack',
	execute(client, message, args, db) {
        message.channel.send('<@523963702245064725>')
        message.channel.send('I hate him')
	},
};
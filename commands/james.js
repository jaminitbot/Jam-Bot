module.exports = {
	name: 'james',
	description: 'Get some opinions on James',
	usage: 'james',
	execute(client, message, args, db) {
        message.channel.send('We love him')
	},
};
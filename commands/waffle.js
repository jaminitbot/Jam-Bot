module.exports = {
	name: 'waffle',
	description: 'Get some opinions on waffle',
	usage: 'waffle',
	execute(client, message, args, db) {
        message.channel.send('The meme master himself')
	},
};
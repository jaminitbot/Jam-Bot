module.exports = {
	name: 'shutdown',
	description: 'STOPS THE BOT',
	permissions: ['ADMINISTRATOR'],
	usage: '!shutdown',
	execute(client, message, args, db) {
        process.exit()
	},
};
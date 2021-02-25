module.exports = {
	name: 'gif',
	description: 'Gets a gif',
	usage: 'gif hello',
	execute(client, message, args, db, logger) {
		message.reply('gifs no longer work because giphy didn\'t give me an api key')
	},
}
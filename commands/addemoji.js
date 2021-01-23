module.exports = {
	name: 'addemoji',
	description: 'Purges messages',
	permissions: '',
	usage: 'addemoji URL NAME',
	execute(client, message, args, db) {
		if (!args[0] || !args[1]) return message.reply(this.usage)
		message.guild.emojis.create(args[0], args[1])
			.then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
			.catch(console.error);
	},
}
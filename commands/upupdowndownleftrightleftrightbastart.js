module.exports = {
	name: 'upupdowndownleftrightleftrightbastart',
	description: 'It\'s a secret',
	execute(client, message, args, db, logger) {
		message.channel.send('The command you found does literally nothing, you sad nerd.')
		message.member.setNickname('Sad Nerd', 'upupdowndownleftrightleftrightbastart')
			.catch(() => { })
	}
}

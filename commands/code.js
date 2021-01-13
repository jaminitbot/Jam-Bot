module.exports = {
	name: 'upupdowndownleftrightleftrightbastart',
	description: 'oooh',
	usage: 'Well',
	execute(client, message, args, db) {
        message.channel.send('The command you found does literally nothing')
        message.member.setNickname('Sad Nerd', 'upupdowndownleftrightleftrightbastart')
            .catch(() => {})
	},
}
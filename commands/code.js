module.exports = {
	name: 'upupdowndownleftrightleftrightbastart',
	description: 'oooh',
	usage: 'Well',
	execute(client, message, args, db) {
        message.channel.send('The command you found does literally nothing')
        const nick = message.member.setNickname('Sad Nerd', 'Code')
        nick.catch(() => {}); // add an empty catch handler
	},
};
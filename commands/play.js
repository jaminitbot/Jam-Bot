module.exports = {
	name: 'play',
	description: 'Oh',
	usage: 'play',
	async execute(client, message, args, db) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('https://download.realmp3.fun/k/Rick-Astley-Never-Gonna-Give-You-Up.mp3')
            dispatcher.on('start', () => {
                message.reply('you got it!')
            });
            dispatcher.on('finish', () => {
                connection.disconnect()
            });
        } else {
            return message.reply('Join a voice channel to use that!')
        }
	},
};
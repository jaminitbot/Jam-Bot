module.exports = {
	name: 'purge',
	description: 'Purges messages',
	execute(client, message, args, db) {
        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount) {
            message.reply('You need to specify how many messages to delete!')
            return
        } else if (deleteCount < 1){
            message.reply('You can\'t delete less than one message!')
            return
        } else if (deleteCount > 100){
            message.reply('You can\'t delete more than 100 messages in one go!')
            return
        }
        message.channel.bulkDelete(deleteCount + 1).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	},
};
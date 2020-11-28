module.exports = {
  name: 'purge',
  description: 'Purges messages',
  permissions: 'MANAGE_MESSAGES',
  execute(client, message, args, db) {
    if (!message.member.hasPermission(['MANAGE_MESSAGES']))
      return message.reply(
        'You do not have permission to perform this command!'
      ); // Checks if the user can manage messages
    if (!message.guild.me.hasPermission(['MANAGE_MESSAGES']))
      return message.channel.send(
        'I dont have permission to perform this command, try inviting me again!'
      ); // Checks if bot can manage messages
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount) {
      message.reply('You need to specify how many messages to delete!');
      return;
    } else if (deleteCount < 1) {
      message.reply("You can't delete less than one message!");
      return;
    } else if (deleteCount > 99) {
      // Discord api doesn't let us do more than 100
      message.reply("You can't delete more than 99 messages in one go!");
      return;
    }
    message.channel
      .bulkDelete(deleteCount + 1)
      .catch((error) =>
        message.reply(`Couldn't delete messages because of: ${error}`)
      );
  },
};

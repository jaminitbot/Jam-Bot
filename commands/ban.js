module.exports = {
  name: 'ban',
  description: 'Bans a user',
  permissions: 'BAN_MEMBERS',
  execute(client, message, args, db) {
    if (!message.member.hasPermission(['BAN_MEMBERS']))
      return message.reply(
        'You do not have permission to perform this command!'
      ); // Checks if the user can ban
    if (!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR']))
      return message.channel.send(
        'I dont have permission to perform this command, try inviting me again!'
      ); // Checks if bot can ban
    const memberToBan =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]); // Gets the mentioned user
    if (!memberToBan) return message.reply("You didn't mention a valid user");
    if (message.author.id == memberToBan.id)
      return message.reply("You can't ban yourself!"); // Checks if the user mentioned themself
    let reason = args.splice(1).join(' ');
    const authorRole = message.member.roles.highest;
    const targetRole = memberToBan.roles.highest;
    if (!message.member.hasPermission(['ADMINISTRATOR'])) {
      // Admins without a role need to be able to overide
      if (!targetRole.comparePositionTo(authorRole) <= 0)
        return message.reply(
          "You can't kick them, your role is lower than them!"
        ); // Doesn't allow a user to ban someone whose role is higher than theres https://stackoverflow.com/questions/64056025/discord-js-ban-user-permissions-command
    }
    message.guild
      .member(memberToBan)
      .ban(memberToBan, { reason: reason, days: 1 });
    message.reply(`I banned ${memberToBan}`);
  },
};

module.exports = {
	name: 'ban',
	description: 'Bans a user',
	execute(client, message, args, db) {
        if(!message.member.hasPermission(["BAN_MEMBERS"])) return message.reply("You do not have permission to perform this command!");
        if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("I dont have permission to perform this command, try inviting me again!");
        const memberToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!memberToBan) return message.reply('You didn\'t mention a valid user')
        if (message.author.id == memberToBan.id) return message.reply('You can\'t ban yourself!')
        let reason = args.splice(1).join(' ');
        const authorRole = message.member.roles.highest;
        const targetRole = memberToBan.roles.highest;
        if (!targetRole.comparePositionTo(authorRole) <= 0) return message.reply('You can\'t ban them, your role is lower than them!') // https://stackoverflow.com/questions/64056025/discord-js-ban-user-permissions-command
        message.guild.member(memberToBan).ban(memberToBan, {reason: reason, days: 1});
        message.delete()
        message.reply(`I banned ${memberToBan}`)
	},
};
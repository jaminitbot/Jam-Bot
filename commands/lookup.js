const permission = require('../functions/permission')
module.exports = {
	name: 'lookup',
	description: 'Allows you to lookup information about a user',
	permissions: 'MANAGE_MESSAGES',
	usage: 'lookup @user',
	execute(client, message, args, db) {
        if (!permission.checkperm(message.member, ['MANAGE_MESSAGES'])) return message.reply('You don\'t have permission to run that command!')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.reply(`You need to mention a *valid* user to run that command\nE.g: ${this.usage}`)
        const userName = user.user.username + "#" + user.user.discriminator
        const avatar = user.user.avatarURL() || user.user.defaultAvatarURL
        const isBot = user.user.bot
        const createdAt = user.user.createdAt
        const nickName = user.nickname || user.user.username
        const joinedDate = user.joinedAt
        const id = user.id
        let roles = ""
        user.roles.cache.forEach(role => {
            roles = `${roles} ${role.name},`
        })
        const intiatedUser = message.member.user.username + "#" + message.member.user.discriminator
        const intiatedAvatar = message.member.user.avatarURL()
        let embed = {
            author: {
                name: userName,
                icon_url: avatar
              },
            "description": `Nickname: ${nickName}\nAccount Creation: ${createdAt}\nJoined on: ${joinedDate}\nIs Bot: ${isBot}\nID: ${id}\nRoles: ${roles}`,
            "footer": {
                "text": `Command issued by ${intiatedUser}`,
                "icon_url": intiatedAvatar
            },
            "timestamp": Date.now(),
            "color": "#14904B"
        }
        message.channel.send({embed: embed})
	},
};
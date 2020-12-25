const permission = require('../functions/permission')
module.exports = {
	name: 'lookup',
	description: 'Allows you to lookup information about a user or role',
	permissions: ['MANAGE_MESSAGES'],
	usage: 'lookup @user',
	execute(client, message, args, db) {
        if (!args[0]) return message.reply('Usage: ' + this.usage)
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const intiatedUser = message.member.user.username + "#" + message.member.user.discriminator
        const intiatedAvatar = message.member.user.avatarURL()
        if (!user) { // No valid user, we'll check if its a role
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
            if (!role) { // Nothing is found
                return message.reply('That is not a valid user or role.')
            }
            const createdAt = role.createdAt
            const mentionable = String(role.mentionable).toUpperCase()
            const id = role.id
            const position = role.position
            var embed = {
                author: {
                    name: 'Role: ' + role.name,
                },
                "description": `Id: ${id}\nCreated at: ${createdAt}\nMentionable: ${mentionable}\nPosition: ${position}`,
                "footer": {
                    "text": `Command issued by ${intiatedUser}`,
                    "icon_url": intiatedAvatar
                },
                "timestamp": Date.now(),
                "color": "#14904B"
            }
        } else { // We got a valid user
            const userName = user.user.username + "#" + user.user.discriminator
            const avatar = user.user.avatarURL() || user.user.defaultAvatarURL
            const isBot = String(user.user.bot).toUpperCase()
            const createdAt = user.user.createdAt
            const nickName = user.nickname || user.user.username
            const joinedDate = user.joinedAt
            const id = user.id
            let roles = ""
            user.roles.cache.forEach(role => {
                roles = `${roles} ${role.name},`
            })
            var embed = {
                author: {
                    name: 'User: ' + userName,
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
            
        }
        message.channel.send({embed: embed})
	},
};
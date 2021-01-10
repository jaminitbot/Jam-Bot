module.exports = {
    name: 'lookup',
    description: 'Allows you to lookup information about a user or role',
    permissions: ['MANAGE_MESSAGES'],
    usage: 'lookup @user|@role',
    execute(client, message, args, db) {
        if (!args[0]) return message.reply('Usage: ' + this.usage)
        // Basic info
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const intiatedUser = message.member.user.username + "#" + message.member.user.discriminator
        const intiatedAvatar = message.member.user.avatarURL()
        if (user) { // Valid user found, get info
            const userName = user.user.username + "#" + user.user.discriminator
            const avatar = user.user.avatarURL() || user.user.defaultAvatarURL
            const isBot = String(user.user.bot).toUpperCase()
            const createdAt = user.user.createdAt
            const nickName = user.nickname || user.user.username
            const { joinedDate, id } = user
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
            }

        } else { // Didn't get a valid role, maybe its a role?
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
            if (role) {
                const { id, position, createdAt } = role
                const mentionable = String(role.mentionable).toUpperCase()
                var embed = {
                    author: {
                        name: 'Role: ' + role.name,
                    },
                    "description": `Id: ${id}\nCreated at: ${createdAt}\nMentionable: ${mentionable}\nPosition: ${position}`,
                }
            } else { // No role found
                return message.reply('That is not a valid user or role.\n' + this.usage)
            }

        }
        embed = {
            ...embed, // Concat previous bits of embed
            "footer": {
                "text": `Command issued by ${intiatedUser}`,
                "icon_url": intiatedAvatar
            },
            "color": "#14904B",
            "timestamp": Date.now()
        }
        message.channel.send({ embed: embed })
    },
};
module.exports = {
	name: 'lookup',
	description: 'Displays information about a specific user or role',
	permissions: ['MANAGE_MESSAGES'],
	usage: 'lookup @user|@role',
	execute(client, message, args, db, logger) {
		if (!args[0]) return message.reply('Usage: ' + this.usage)
		// Basic info
		message.channel.send(':mag_right: Looking up...').then(sent => {
			let embed
			const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
			if (user) { // Valid user found, get info
				const userName = user.user.username + '#' + user.user.discriminator
				const avatar = user.user.avatarURL() || user.user.defaultAvatarURL
				const isBot = String(user.user.bot).toUpperCase()
				const createdAt = user.user.createdAt
				const nickName = user.nickname || user.user.username
				const { id } = user
				let roles = ''
				user.roles.cache.forEach(role => {
					roles = `${roles} ${role.name},`
				})
				embed = {
					author: {
						name: 'User: ' + userName,
						icon_url: avatar
					},
					description: `Nickname: ${nickName}\nAccount Creation: ${createdAt}\nID: ${id}\nRoles: ${roles}`
				}
			} else { // Didn't get a valid user, maybe its a role?
				const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
				if (role) { // Valid role
					const { id, position, createdAt, name, mentionable } = role
					embed = {
						author: {
							name: 'Role: ' + name
						},
						description: `Id: ${id}\nCreated at: ${createdAt}\nMentionable: ${String(mentionable).toUpperCase()}\nPosition: ${position}`
					}
				} else { // No role or user found
					return sent.edit('That is not a valid user or role.')
				}
			}
			const intiatedUser = message.author.tag
			const intiatedAvatar = message.member.user.avatarURL()
			embed = {
				...embed, // Concat previous bits of embed
				footer: {
					text: `Command issued by ${intiatedUser}`,
					icon_url: intiatedAvatar
				},
				color: '#14904B',
				timestamp: Date.now()
			}
			sent.edit({ embed: embed })
		})
	}
}

import { Message, MessageEmbed, Role } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getUserFromString } from '../../functions/util'
export const name = 'lookup'
export const description = 'Displays information about a specific user or role'
export const permissions = ['MANAGE_MESSAGES']
export const usage = 'lookup @user|@role'
export const aliases = ['info']
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addMentionableOption(option =>
		option.setName('lookup')
			.setDescription('The user/role to lookup')
			.setRequired(true))
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0]) return message.reply('Usage: ' + this.usage)
	// Basic info
	const lookupMessage = await message.channel.send(':mag_right: Looking up...')
	const embed = new MessageEmbed
	const user = await getUserFromString(message.guild, args[0])
	if (user) {
		// Valid user found, get info
		const userName =
			user.user.username + '#' + user.user.discriminator
		const avatar =
			user.user.avatarURL() || user.user.defaultAvatarURL
		const isBot = String(user.user.bot).toUpperCase()
		const createdAt = user.user.createdAt
		const nickName = user.nickname || user.user.username
		const { id } = user
		let roles = ''
		user.roles.cache.forEach((role) => {
			roles = `${roles} ${role.name},`
		})
		embed.addField('Nickname', nickName, true)
		embed.addField('Account Creation', createdAt.toDateString(), true)
		embed.addField('Id', id, true)
		embed.addField('Bot', isBot, true)
		embed.addField('Roles', roles, true)
		embed.setAuthor('User: ' + userName, avatar)

	} else {
		// Didn't get a valid user, maybe its a role?
		const role: Role =
			message.mentions.roles.first() ||
			await message.guild.roles.fetch(args[0])
		if (role) {
			// Valid role
			const { id, position, createdAt, name, mentionable } = role
			embed.addField('ID', id, true)
			embed.addField('Mentionable', String(mentionable), true)
			embed.addField('Position', position.toString(), true)
			embed.addField('Created At', createdAt.toDateString(), true)
			embed.setTitle('Role: ' + name)
		} else {
			// No role or user found
			return lookupMessage.edit('That is not a valid user or role.')
		}
	}
	const initiatedUser = message.author.tag
	const initiatedAvatar = message.member.user.avatarURL()
	embed.setFooter('Command issued by ' + initiatedUser, initiatedAvatar)
	embed.setColor('#007991')
	embed.setTimestamp(Date.now())
	lookupMessage.edit({ content: null, embeds: [embed] })
}
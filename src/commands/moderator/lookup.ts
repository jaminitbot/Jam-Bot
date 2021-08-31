import { CommandInteraction, Guild, GuildMember, Message, MessageEmbed, Role, TextBasedChannels } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import dayjs from "dayjs"
import { getRoleFromString, getUserFromString } from "../../functions/util"

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
async function lookupUserOrRole(channel:TextBasedChannels, guild:Guild, member:GuildMember, role:Role) {
	const embed = new MessageEmbed
	embed.setColor('#007991')
	if (member && (!role || !role.color) && member.roles) {
		// Valid user found, get info
		const userName = member.user.tag
		const avatar = member.user.avatarURL() ?? member.user.defaultAvatarURL
		const isBot = String(member.user.bot).toUpperCase()
		const createdAt = dayjs(member.user.createdAt).format('HH:mm [-] DD/MM/YYYY')
		const nickName = member.nickname ?? member.user.username
		const { id } = member
		let roles = ''
		member.roles.cache.forEach((role) => {
			roles = `${roles} ${role.name},`
		})
		embed.addField('Nickname', nickName, true)
		embed.addField('Account Creation', createdAt, true)
		embed.addField('Id', id, true)
		embed.addField('Bot', isBot, true)
		embed.addField('Roles', roles, true)
		embed.setAuthor('User: ' + userName, avatar)

	} else {
		// Didn't get a valid user, maybe its a role?
		if (role && role.color) {
			// Valid role
			const { id, position, createdAt, name, mentionable } = role
			embed.addField('ID', id, true)
			embed.addField('Mentionable', String(mentionable), true)
			embed.addField('Position', position.toString(), true)
			embed.addField('Created At', createdAt.toDateString(), true)
			embed.setTitle('Role: ' + name)
		} else {
			// No role or user found
			embed.setTitle('Lookup: Failed')
			embed.setDescription('No user/role specified!')
			return embed
		}
	}
	embed.setTimestamp(Date.now())
	return embed
}
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0]) return message.reply('Usage: ' + this.usage)
	const user = await getUserFromString(message.guild, args[0])
	const role = await getRoleFromString(message.guild, args[0])
	const embed = await lookupUserOrRole(message.channel, message.guild, user, role)
	const initiatedUser = message.member.user.tag
	const initiatedAvatar = message.member.user.avatarURL()
	embed.setFooter('Command issued by ' + initiatedUser, initiatedAvatar)
	message.channel.send({embeds: [embed]})
}
export async function executeSlash(client: BotClient, interaction:CommandInteraction) {
	await interaction.deferReply()
	const userRole = interaction.options.getMentionable('lookup')
	// @ts-expect-error
	const embed = await lookupUserOrRole(interaction.channel, interaction.guild, userRole, userRole)
	interaction.editReply({embeds: [embed]})
}
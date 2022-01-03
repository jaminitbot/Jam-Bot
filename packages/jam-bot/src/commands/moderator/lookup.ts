import { CommandInteraction, Guild, GuildMember, Message, MessageEmbed, Role, TextBasedChannel } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getRoleFromString, getUserFromString } from '../../functions/util'
import i18next from 'i18next'
import { format } from 'date-fns'

export const name = 'lookup'
export const description = 'Displays information about a specific user or role'
export const permissions = ['MANAGE_MESSAGES']
export const usage = 'lookup @user|@role'
export const aliases = ['info']
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addMentionableOption((option) =>
        option
            .setName('lookup')
            .setDescription('The user/role to lookup')
            .setRequired(true)
    )

async function lookupUserOrRole(
    channel: TextBasedChannel,
    guild: Guild,
    member: GuildMember,
    role: Role
) {
    const embed = new MessageEmbed()
    embed.setColor('#007991')
    if (member && (!role || !role.color) && member.roles) {
        // Valid user found, get info
        const userName = member.user.tag
        const avatar = member.user.avatarURL() ?? member.user.defaultAvatarURL
        const isBot = String(member.user.bot).toUpperCase()
        const createdAt = format(member.user.createdAt, 'HH:mm - dd/MM/yyyy')
        const nickName = member.nickname ?? member.user.username
        const { id } = member
        let roles = ''
        member.roles.cache.forEach((role) => {
            roles = `${roles} ${role.name},`
        })
        embed.addField(i18next.t('lookup.USER_NICKNAME'), nickName, true)
        embed.addField(i18next.t('lookup.USER_CREATION'), createdAt, true)
        embed.addField(i18next.t('lookup.USER_ID'), id, true)
        embed.addField(i18next.t('lookup.USER_IS_BOT'), isBot, true)
        embed.addField(i18next.t('lookup.USER_ROLES'), roles, true)
        embed.setAuthor(
            i18next.t('lookup.USER_FOOTER', { tag: userName }),
            avatar
        )
    } else {
        // Didn't get a valid user, maybe its a role?
        if (role && role.color) {
            // Valid role
            const { id, createdAt, name, mentionable } = role
            embed.setTitle(i18next.t('lookup.ROLE_TITLE', { name: name }))
            embed.addField(i18next.t('lookup.ROLE_ID'), id, true)
            embed.addField(
                i18next.t('lookup.ROLE_IS_MENTIONABLE'),
                String(mentionable),
                true
            )
            embed.addField(
                i18next.t('lookup.ROLE_CREATED_AT'),
                createdAt.toDateString(),
                true
            )
        } else {
            // No role or user found
            embed.setDescription(i18next.t('lookup.LOOKUP_INVALID_USER_ROLE'))
            return embed
        }
    }
    embed.setTimestamp(Date.now())
    return embed
}

export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    if (!args[0]) return i18next.t('lookup.NO_ARGUMENTS_SPECIFIED')
    const user = await getUserFromString(message.guild, args[0])
    const role = await getRoleFromString(message.guild, args[0])
    const embed = await lookupUserOrRole(
        message.channel,
        message.guild,
        user,
        role
    )
    const initiatedUser = message.member.user.tag
    const initiatedAvatar = message.member.user.avatarURL()
    embed.setFooter('Command issued by ' + initiatedUser, initiatedAvatar)
    await message.channel.send({ embeds: [embed] })
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    await interaction.deferReply()
    const userRole = interaction.options.getMentionable('lookup')
    const embed = await lookupUserOrRole(
        interaction.channel,
        interaction.guild,
        // @ts-expect-error
        userRole,
        userRole
    )
    await interaction.editReply({ embeds: [embed] })
}

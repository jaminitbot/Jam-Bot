import { CommandInteraction, Message } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ban, moddable, parseDuration } from '../../functions/mod'
import i18next from 'i18next'

export const name = 'ban'
export const description = 'Bans a user from the server'
export const permissions = ['BAN_MEMBERS']
export const usage = 'ban @user'
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription('The user to ban')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('duration')
            .setDescription('Duration to ban the user for')
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName('reason')
            .setDescription('The reason for banning the user')
            .setRequired(false)
    )

export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    message.channel.send(
        i18next.t('general:ONLY_SLASH_COMMAND', {command: '/mute'})
    )
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    if (!interaction.guild.me.permissions.has('BAN_MEMBERS'))
        return interaction.reply({
            content: i18next.t('general:BOT_INVALID_PERMISSION', {
                friendlyPermissionName: 'ban members',
                permissionName: permissions[0],
            }),
            ephemeral: true,
        })
    const targetUser = interaction.options.getUser('user')
    const isModdable = await moddable(
        interaction.guild,
        targetUser.id,
        interaction.user.id
    )
    switch (isModdable) {
        case 1:
            return interaction.reply({
                content: i18next.t('mod.INVALID_USER'),
                ephemeral: true,
            })
        case 2:
            return interaction.reply({
                content: i18next.t('mod.SAME_USER', {action: 'ban'}),
                ephemeral: true,
            })
        case 3:
            return interaction.reply({
                content: i18next.t('mod.BOT_ROLE_TOO_LOW'),
                ephemeral: true,
            })
        case 4:
            return interaction.reply({
                content: i18next.t('USER_ROLE_TOO_LOW'),
                ephemeral: true,
            })
    }
    const reason = interaction.options.getString('reason')
    const formattedReason = `${interaction.user.tag}: ${reason ?? i18next.t('mod.NO_REASON_SPECIFIED')
    }`
    const duration = interaction.options.getString('duration')
    const parsedDuration = parseDuration(duration)
    const banResult = await ban(
        interaction.guild,
        targetUser.id,
        formattedReason,
        parsedDuration
    )
    if (banResult == 0) {
        if (duration) {
            interaction.reply({
                content: i18next.t('mod.ACTION_SUCCESSFUL_WITH_DURATION', {
                    tag: targetUser.tag,
                    action: 'banned',
                    duration: parsedDuration,
                    reason: reason ?? i18next.t('mod.NO_REASON_SPECIFIED'),
                }),
                allowedMentions: {parse: []},
            })
        } else {
            interaction.reply({
                content: i18next.t('mod.ACTION_SUCCESSFUL', {
                    tag: targetUser.tag,
                    action: 'banned',
                    reason: reason ?? i18next.t('mod.NO_REASON_SPECIFIED'),
                }),
                allowedMentions: {parse: []},
            })
        }
    } else {
        interaction.reply(i18next.t('general:UNKNOWN_ERROR'))
    }
}

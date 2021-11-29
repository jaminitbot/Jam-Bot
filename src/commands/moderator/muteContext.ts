import { ContextMenuInteraction } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { moddable, mute, parseDuration } from '../../functions/mod'
import i18next from 'i18next'
import muteCommand = require('./mute')

export const name = 'Mute User'
export const permissions = muteCommand.permissions
export const allowInDm = false
export const interactionType = 2

export async function executeContextMenu(
    client: BotClient,
    interaction: ContextMenuInteraction
) {
    if (!interaction.guild.me.permissions.has('MANAGE_ROLES'))
        return interaction.reply({
            content:
                'I don\'t have permission to manage roles! Ask an admin to check my permissions!',
            ephemeral: true,
        })
    const targetUser = await interaction.guild.members.fetch(
        interaction.targetId
    )
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
                content: i18next.t('mod.SAME_USER', {action: 'mute'}),
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
    const reason = 'Muted from context menu'
    const formattedReason = `${interaction.user.tag}: ${reason ?? i18next.t('mod.NO_REASON_SPECIFIED')
    }`
    const duration: string = null
    const parsedDuration = parseDuration(duration)
    const muteResult = await mute(
        interaction.guild,
        targetUser.id,
        formattedReason,
        parsedDuration
    )
    if (muteResult == 0) {
        await interaction.reply({
            content: i18next.t('mod.ACTION_SUCCESSFUL', {
                tag: targetUser.user.tag,
                action: 'muted',
                reason: reason ?? i18next.t('mod.NO_REASON_SPECIFIED'),
            }),
            allowedMentions: {parse: []},
        })
    } else if (muteResult == 3) {
        await interaction.reply({
            content: i18next.t('mute.NO_MUTED_ROLE'),
            ephemeral: true,
        })
    } else {
        await interaction.reply(i18next.t('general:UNKNOWN_ERROR'))
    }
}

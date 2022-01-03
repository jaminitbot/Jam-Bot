import {
    ButtonInteraction, GuildMember, Role,
} from 'discord.js'
import { BotClient } from '../../customDefinitions'
import i18next from 'i18next'

export const name = 'reactionRoleHandler'
export const description = 'Internal Only'
export const allowInDm = false

export async function executeButton(
    client: BotClient,
    interaction: ButtonInteraction
) {
    const roleId = interaction.customId.split('-')[1]
    let role: Role
    try {
        role = await interaction.guild.roles.fetch(roleId)
    } catch {
        interaction.reply({
            content: i18next.t('reactionRoleHandler.FAILED_FETCHING_ROLE', { roleId: role.id }),
            ephemeral: true
        })
        return
    }
    let member: GuildMember
    try {
        member = await interaction.guild.members.fetch(interaction.user.id)
    } catch {
        interaction.reply({ content: i18next.t('reactionRoleHandler.FAILED_FETCHING_MEMBER'), ephemeral: true })
        return
    }
    if (member.roles.cache.has(role.id)) {
        try {
            await member.roles.remove(role)
        } catch {
            interaction.reply({
                content: i18next.t('reactionRoleHandler.FAILED_REMOVING_ROLE', { roleName: role.name }),
                ephemeral: true
            })
            return
        }
        interaction.reply({
            content: i18next.t('reactionRoleHandler.SUCCESSFULLY_REMOVED_ROLE', { roleName: role.name }),
            ephemeral: true
        })
    } else {
        try {
            await member.roles.add(role)
        } catch {
            interaction.reply({
                content: i18next.t('reactionRoleHandler.FAILED_ADDING_ROLE', { roleName: role.name }),
                ephemeral: true
            })
            return
        }
        interaction.reply({
            content: i18next.t('reactionRoleHandler.SUCCESSFULLY_ADDED_ROLE', { roleName: role.name }),
            ephemeral: true
        })
    }
}

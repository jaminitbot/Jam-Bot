import { AutocompleteInteraction, CommandInteraction, Message, } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'
import { getGuildSetting } from '../../functions/db'

export const name = 'roles'
export const description = 'Manages your self-assignable roles'
export const usage = 'role'
export const allowInDm = false
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addSubcommand(
        (command) =>
            command
                .setName('add')
                .setDescription('Gives you a self-assignable role')
                .addStringOption((option) =>
                    option
                        .setName('role')
                        .setDescription('The role you\'d like to give yourself')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
    )
    .addSubcommand(
        (command) =>
            command
                .setName('remove')
                .setDescription('Removes a self-assignable role from yourself')
                .addStringOption((option) =>
                    option
                        .setName('role')
                        .setDescription('The role you\'d like to remove from yourself')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
    )
    .addSubcommand((command) =>
        command
            .setName('list')
            .setDescription('Lists the available self-assignable roles')
    )

export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    message.channel.send(
        i18next.t('general:ONLY_SLASH_COMMAND', { command: name })
    )
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) {
        return interaction.reply({
            content: i18next.t('general:BOT_INVALID_PERMISSION', {
                friendlyPermissionName: 'manage roles',
                permissionName: 'MANAGE_ROLES',
            }),
            ephemeral: true,
        })
    }
    const subCommand = interaction.options.getSubcommand()
    const roleId = interaction.options.getString('role')
    const role = await interaction.guild.roles.fetch(roleId)
    const allowedRoles: Array<string> =
        (await getGuildSetting(
            interaction.guild.id,
            {
                group: 'assignableRoles',
                setting: 'allowedRoles'
            }
        )) ?? []
    if (subCommand == 'add' || subCommand == 'remove') {
        if (!allowedRoles || !allowedRoles.includes(role.id)) {
            return interaction.reply({
                content: i18next.t('roles.ROLE_NOT_WHITELISTED', {
                    type: subCommand,
                    role: role.id,
                }),
                ephemeral: true,
            })
        }
        if (role.position > interaction.guild.me.roles.highest.position) {
            return interaction.reply({
                content: i18next.t('roles.ROLE_HIGHER_THAN_ME', {
                    role: role.id,
                }),
                ephemeral: true,
            })
        }
    }
    const member = await interaction.guild.members.fetch(interaction.user.id)
    if (subCommand == 'add') {
        if (member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: i18next.t('roles.USER_ALREADY_HAS_ROLE', {
                    role: role.id,
                }),
                ephemeral: true,
            })
        }
        try {
            await member.roles.add(role.id)
        } catch {
            return interaction.reply(i18next.t('roles.UNKNOWN_ERROR'))
        }
    } else if (subCommand == 'remove') {
        if (!member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: i18next.t('roles.USER_DOESNT_HAVE_ROLE', {
                    role: role.id,
                }),
                ephemeral: true,
            })
        }
        try {
            await member.roles.remove(role.id)
        } catch {
            return interaction.reply(i18next.t('roles.UNKNOWN_ERROR'))
        }
    } else if (subCommand == 'list') {
        let allowListFormatted = ''
        if (allowedRoles.length) {
            for (const roleId of allowedRoles) {
                const role = await interaction.guild.roles.fetch(roleId)
                allowListFormatted += `<@&${role.id}>` + ', '
            }
            allowListFormatted = allowListFormatted.substring(
                0,
                allowListFormatted.length - 2
            )
        } else {
            allowListFormatted = i18next.t('roles.NO_ROLES_ON_ALLOW_LIST')
        }
        return interaction.reply({
            content: i18next.t('roles.ROLES_ON_ALLOW_LIST', {
                roles: allowListFormatted,
            }),
            ephemeral: true,
        })
    }
    const type = subCommand == 'add' ? 'added' : 'removed'
    await interaction.reply({
        content: i18next.t('roles.MANAGED_SUCCESS', {
            role: role.id,
            type: type,
        }),
        ephemeral: true,
    })
}

export async function executeAutocomplete(
    client: BotClient,
    interaction: AutocompleteInteraction
) {
    const allowedRoles: Array<string> =
        (await getGuildSetting(
            interaction.guild.id,
            {
                group: 'assignableRoles',
                setting: 'allowedRoles'
            }
        )) ?? []
    if (!allowedRoles.length) {
        await interaction.respond([])
        return
    }
    const input = interaction.options.getFocused()
    const subCommand = interaction.options.getSubcommand()
    const matchedChoices = []
    const member = await interaction.guild.members.fetch(interaction.user.id)
    for (const roleID of allowedRoles) {
        const role = await interaction.guild.roles.fetch(roleID)
        if (
            (role.name.toLowerCase().startsWith(String(input).toLowerCase()) ||
                !input) &&
            (member.roles.cache.has(roleID) || subCommand == 'add')
        ) {
            matchedChoices.push({ name: role.name, value: role.id })
        }
        if (matchedChoices.length >= 24) {
            break
        }
    }
    await interaction.respond(matchedChoices)
}

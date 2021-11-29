import { CommandInteraction, Message } from 'discord.js'
import { BotClient, Permissions } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getGuildSetting, setGuildSetting, } from '../../functions/db'
import { booleanToHuman, removeItemFromArray } from '../../functions/util'
import i18next from 'i18next'

export const name = 'settings'
export const description = 'Configures the bot\'s settings'
export const permissions: Permissions = ['MANAGE_GUILD']
export const usage = 'settings'
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addSubcommandGroup((group) =>
        group
            .setName('general')
            .setDescription('General settings')
            .addSubcommand((command) =>
                command
                    .setName('prefix')
                    .setDescription('Sets the bot\'s prefix')
                    .addStringOption((option) =>
                        option
                            .setName('prefix')
                            .setDescription('The new prefix')
                            .setRequired(false)
                    )
            )
    )
    .addSubcommandGroup((group) =>
        group
            .setName('suggestions')
            .setDescription('Suggestion related settings')
            .addSubcommand((command) =>
                command
                    .setName('channel')
                    .setDescription('Sets the suggestion channel')
                    .addChannelOption((option) =>
                        option
                            .setName('channel')
                            .setDescription(
                                'The channel to send suggestions to'
                            )
                            .setRequired(false)
                    )
            )
            .addSubcommand((command) =>
                command
                    .setName('useable')
                    .setDescription('Whether to allow suggestions to be made')
                    .addBooleanOption((option) =>
                        option
                            .setName('on')
                            .setDescription('Send suggestions?')
                            .setRequired(false)
                    )
            )
    )
    .addSubcommandGroup((group) =>
        group
            .setName('modlog')
            .setDescription('Modlog related settings')
            .addSubcommand((command) =>
                command
                    .setName('channels')
                    .setDescription('Sets the various channels to send modlogs')
                    .addChannelOption((option) =>
                        option
                            .setName('default')
                            .setDescription(
                                'The default channel for modlogs (used if other channels aren\'t specified and the event is turned on'
                            )
                            .setRequired(false)
                    )
                    .addChannelOption((option) =>
                        option
                            .setName('messages')
                            .setDescription(
                                'Channel to message related modlogs'
                            )
                            .setRequired(false)
                    )
                    .addChannelOption((option) =>
                        option
                            .setName('members')
                            .setDescription(
                                'Channel to send member related modlogs'
                            )
                            .setRequired(false)
                    )
                    .addChannelOption((option) =>
                        option
                            .setName('server')
                            .setDescription(
                                'Channel to send server related modlogs'
                            )
                            .setRequired(false)
                    )
                    .addChannelOption((option) =>
                        option
                            .setName('joinleaves')
                            .setDescription(
                                'Channel to send join/leave modlogs'
                            )
                            .setRequired(false)
                    )
            )
            .addSubcommand((command) =>
                command
                    .setName('log')
                    .setDescription('Turns on/off logging of certain events')
                    .addBooleanOption((option) =>
                        option
                            .setName('messages')
                            .setDescription('Log message events?')
                            .setRequired(false)
                    )
                    .addBooleanOption((option) =>
                        option
                            .setName('members')
                            .setDescription('Log member events?')
                            .setRequired(false)
                    )
                    .addBooleanOption((option) =>
                        option
                            .setName('server')
                            .setDescription('Log server events?')
                            .setRequired(false)
                    )
                    .addBooleanOption((option) =>
                        option
                            .setName('joinleaves')
                            .setDescription('Log join/leave events?')
                            .setRequired(false)
                    )
            )
    )
    .addSubcommandGroup((group) =>
        group
            .setName('roles')
            .setDescription(
                'Manages settings relating to self assignable roles'
            )
            .addSubcommand((command) =>
                command
                    .setName('allow')
                    .setDescription(
                        'Allows a role to be self-assigned by members'
                    )
                    .addRoleOption((option) =>
                        option
                            .setName('role')
                            .setDescription('The role to allow')
                            .setRequired(true)
                    )
            )
            .addSubcommand((command) =>
                command
                    .setName('disallow')
                    .setDescription('Remove a role from the allow list')
                    .addRoleOption((option) =>
                        option
                            .setName('role')
                            .setDescription('The role to remove')
                            .setRequired(true)
                    )
            )
            .addSubcommand((command) =>
                command
                    .setName('list')
                    .setDescription('Lists the currently allowed roles')
            )
    )

async function validTextChannel(client: BotClient, channelId: string) {
    const channel = await client.channels.fetch(channelId)
    if (!channel.isText || channel.type == 'DM') {
        return null
    }
    return channel
}

export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    message.channel.send(
        i18next.t('general:ONLY_SLASH_COMMAND', {command: name})
    )
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    const subCommandGroup = interaction.options.getSubcommandGroup()
    const subCommand = interaction.options.getSubcommand()
    if (subCommandGroup == 'general') {
        if (subCommand == 'prefix') {
            const newPrefix = interaction.options.getString('prefix')
            if (!newPrefix) {
                const currentPrefix =
                    (await getGuildSetting(interaction.guild.id, 'prefix')) ??
                    process.env.defaultPrefix
                await interaction.reply({
                    content: i18next.t('settings.CURRENT_PREFIX', {
                        prefix: currentPrefix,
                    }),
                })
                return
            }
            if (newPrefix.length > 10) {
                await interaction.reply({
                    content: i18next.t('settings.PREFIX_TOO_LONG', {
                        length: 10,
                    }),
                    ephemeral: true,
                })
            } else {
                await setGuildSetting(interaction.guild.id, 'prefix', newPrefix)
                await interaction.reply({
                    content: i18next.t('settings.SET_PREFIX_SUCCESS', {
                        prefix: newPrefix,
                    }),
                })
            }
            return
        }
    } else if (subCommandGroup == 'suggestions') {
        if (subCommand == 'channel') {
            const newSuggestionsChannel =
                interaction.options.getChannel('channel')
            if (!newSuggestionsChannel) {
                const currentSuggestionChannelId = await getGuildSetting(
                    interaction.guild.id,
                    {
                        group: 'suggestions',
                        name: 'channel'
                    }
                )
                const currentSuggestionsChannel = currentSuggestionChannelId
                    ? `<#${currentSuggestionChannelId}>`
                    : 'not set'
                await interaction.reply(
                    i18next.t('settings.CURRENT_SUGGESTIONS_CHANNEL', {
                        channel: currentSuggestionsChannel,
                    })
                )
                return
            }
            const newChannel = await client.channels.fetch(
                newSuggestionsChannel.id
            )
            if (!newChannel.isText || newChannel.type == 'DM') {
                await interaction.reply({
                    content: i18next.t('general:INVALID_CHANNEL_TYPE', {
                        correctType: 'text',
                    }),
                    ephemeral: true,
                })
            } else {
                await setGuildSetting(
                    interaction.guild.id,
                    {
                        group: 'suggestions',
                        name: 'channel',
                        value: newChannel.id
                    }
                )
                await setGuildSetting(
                    interaction.guild.id,
                    {
                        group: 'suggestions',
                        name: 'enabled',
                        value: true
                    }
                )
                const newSuggestionsChannel = `<#${newChannel.id}>`
                await interaction.reply(
                    i18next.t('settings.SET_SUGGESTIONS_CHANNEL_SUCCESS', {
                        channel: newSuggestionsChannel,
                    })
                )
            }
            return
        } else if (subCommand == 'useable') {
            const sendSuggestions = interaction.options.getBoolean('on')
            if (typeof sendSuggestions != 'boolean') {
                await interaction.reply(
                    i18next.t('settings.SUGGESTIONS_ENABLED_DISABLED_CURRENT', {
                        toggle: booleanToHuman(
                            await getGuildSetting(
                                interaction.guild.id,
                                {
                                    group: 'suggestions',
                                    name: 'enabled'
                                }
                            )
                        ),
                    })
                )
                return
            }
            await setGuildSetting(
                interaction.guild.id,
                {
                    group: 'suggestions',
                    name: 'enabled',
                    value: sendSuggestions
                }
            )
            await interaction.reply(
                i18next.t('settings.SET_SUGGESTIONS_ENABLED_DISABLED_SUCCESS', {
                    toggle: booleanToHuman(sendSuggestions),
                })
            )
            return
        }
    } else if (subCommandGroup == 'modlog') {
        if (subCommand == 'channels') {
            const mainChannelRaw = interaction.options.getChannel('default')
            const messagesChannelRaw =
                interaction.options.getChannel('messages')
            const membersChannelRaw = interaction.options.getChannel('members')
            const serverChannelRaw = interaction.options.getChannel('server')
            const joinLeavesChannelRaw =
                interaction.options.getChannel('joinleaves')
            if (
                !mainChannelRaw &&
                !messagesChannelRaw &&
                !membersChannelRaw &&
                !serverChannelRaw &&
                !joinLeavesChannelRaw
            ) {
                const currentMainChannelId = await getGuildSetting(
                    interaction.guild.id,
                    {
                        group: 'modlog',
                        name: 'mainChannelId'
                    }
                )
                const currentMainChannelMentioned = currentMainChannelId
                    ? `<#${currentMainChannelId}>`
                    : 'Not Set'
                const currentMessagesChannelId = await getGuildSetting(
                    interaction.guild.id,
                    {
                        group: 'modlog',
                        name: 'messagesChannelId'
                    }
                )
                const currentMessagesChannelMentioned = currentMessagesChannelId
                    ? `<#${currentMessagesChannelId}>`
                    : 'Not Set'
                const currentMembersChannelId = await getGuildSetting(
                    interaction.guild.id,
                    {
                        group: 'modlog',
                        name: 'membersChannelId'
                    }
                )
                const currentMembersChannelMentioned = currentMembersChannelId
                    ? `<#${currentMembersChannelId}>`
                    : 'Not Set'
                const currentServerChannelId = await getGuildSetting(
                    interaction.guild.id,
                    {
                        group: 'modlog',
                        name: 'serverChannelId'
                    }
                )
                const currentServerChannelMentioned = currentServerChannelId
                    ? `<#${currentServerChannelId}>`
                    : 'Not Set'
                const currentJoinLeavesChannelId = await getGuildSetting(
                    interaction.guild.id,
                    {
                        group: 'modlog',
                        name: 'joinLeavesChannelId'
                    }
                )
                const currentJoinLeavesChannelMentioned =
                    currentJoinLeavesChannelId
                        ? `<#${currentJoinLeavesChannelId}>`
                        : 'Not Set'
                await interaction.reply({
                    content:
                        i18next.t('settings.CURRENT_MODLOG_CHANNEL', {
                            modLogType: 'default',
                            channel: currentMainChannelMentioned,
                        }) +
                        '\n' +
                        i18next.t('settings.CURRENT_MODLOG_CHANNEL', {
                            modLogType: 'message',
                            channel: currentMessagesChannelMentioned,
                        }) +
                        '\n' +
                        i18next.t('settings.CURRENT_MODLOG_CHANNEL', {
                            modLogType: 'member',
                            channel: currentMembersChannelMentioned,
                        }) +
                        '\n' +
                        i18next.t('settings.CURRENT_MODLOG_CHANNEL', {
                            modLogType: 'server',
                            channel: currentServerChannelMentioned,
                        }) +
                        '\n' +
                        i18next.t('settings.CURRENT_MODLOG_CHANNEL', {
                            modLogType: 'join/leaves',
                            channel: currentJoinLeavesChannelMentioned,
                        }),
                })
            } else {
                let response = ''
                if (mainChannelRaw) {
                    const newMainChannel = await validTextChannel(
                        client,
                        mainChannelRaw.id
                    )
                    if (!newMainChannel) {
                        response += i18next.t(
                            'settings.MODLOG_CHANNEL_INVALID',
                            {modLogType: 'default'}
                        )
                    } else {
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                name: 'mainChannelId',
                                value: newMainChannel.id
                            }
                        )
                        response += i18next.t(
                            'settings.SET_MODLOG_CHANNEL_SUCCESS',
                            {
                                modLogType: 'default',
                                channel: `<#${newMainChannel.id}>`,
                            }
                        )
                    }
                }
                if (messagesChannelRaw) {
                    const newMessagesChannel = await validTextChannel(
                        client,
                        messagesChannelRaw.id
                    )
                    if (!newMessagesChannel) {
                        response +=
                            '\n' +
                            i18next.t('settings.MODLOG_CHANNEL_INVALID', {
                                modLogType: 'message',
                            })
                    } else {
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                name: 'messagesChannelId',
                                value: newMessagesChannel.id
                            }
                        )
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                name: 'logMessages',
                                value: true
                            }
                        )
                        response +=
                            '\n' +
                            i18next.t('settings.SET_MODLOG_CHANNEL_SUCCESS', {
                                modLogType: 'message',
                                channel: `<#${newMessagesChannel.id}>`,
                            })
                    }
                }
                if (membersChannelRaw) {
                    const newMembersChannel = await validTextChannel(
                        client,
                        membersChannelRaw.id
                    )
                    if (!newMembersChannel) {
                        response +=
                            '\n' +
                            i18next.t('settings.MODLOG_CHANNEL_INVALID', {
                                modLogType: 'member',
                            })
                    } else {
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                name: 'membersChannelId',
                                value: newMembersChannel.id
                            }
                        )
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                name: 'logMembers',
                                value: true
                            }
                        )
                        response +=
                            '\n' +
                            i18next.t('settings.SET_MODLOG_CHANNEL_SUCCESS', {
                                modLogType: 'member',
                                channel: `<#${newMembersChannel.id}>`,
                            })
                    }
                }
                if (serverChannelRaw) {
                    const newServerChannel = await validTextChannel(
                        client,
                        serverChannelRaw.id
                    )
                    if (!newServerChannel) {
                        response +=
                            '\n' +
                            i18next.t('settings.MODLOG_CHANNEL_INVALID', {
                                modLogType: 'server',
                            })
                    } else {
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                name: 'serverChannelId',
                                value: newServerChannel.id
                            }
                        )
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                name: 'logServer',
                                value: true
                            }
                        )
                        response +=
                            '\n' +
                            i18next.t('settings.SET_MODLOG_CHANNEL_SUCCESS', {
                                modLogType: 'server',
                                channel: `<#${newServerChannel.id}>`,
                            })
                    }
                }
                if (joinLeavesChannelRaw) {
                    const newJoinLeavesChannel = await validTextChannel(
                        client,
                        joinLeavesChannelRaw.id
                    )
                    if (!newJoinLeavesChannel) {
                        response +=
                            '\n' +
                            i18next.t('settings.MODLOG_CHANNEL_INVALID', {
                                modLogType: 'join/leaves',
                            })
                    } else {
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                value: 'joinLeavesChannelId',
                                name: newJoinLeavesChannel.id
                            }
                        )
                        await setGuildSetting(
                            interaction.guild.id,
                            {
                                group: 'modlog',
                                name: 'logJoinLeaves',
                                value: true
                            }
                        )
                        response +=
                            '\n' +
                            i18next.t('settings.SET_MODLOG_CHANNEL_SUCCESS', {
                                modLogType: 'join/leave',
                                channel: `<#${newJoinLeavesChannel.id}>`,
                            })
                    }
                }
                await interaction.reply({content: response})
                return
            }
        } else if (subCommand == 'log') {
            const logMessages = interaction.options.getBoolean('messages')
            const logMembers = interaction.options.getBoolean('members')
            const logServer = interaction.options.getBoolean('server')
            const logJoinLeaves = interaction.options.getBoolean('joinleaves')
            if (
                typeof logMessages != 'boolean' &&
                typeof logMembers != 'boolean' &&
                typeof logServer != 'boolean' &&
                typeof logJoinLeaves != 'boolean'
            ) {
                const currentlogMessagesSetting =
                    (await getGuildSetting(
                        interaction.guild.id,
                        {
                            group: 'modlog',
                            name: 'logMessages'
                        }
                    )) ?? false
                const currentLogMembersSetting =
                    (await getGuildSetting(
                        interaction.guild.id,
                        {
                            group: 'modlog',
                            name: 'logMembers'
                        }
                    )) ?? false
                const currentLogServerSetting =
                    (await getGuildSetting(
                        interaction.guild.id,
                        {
                            group: 'modlog',
                            name: 'logServer'
                        }
                    )) ?? false
                const currentLogJoinLeavesSetting =
                    (await getGuildSetting(
                        interaction.guild.id,
                        {
                            group: 'modlog',
                            name: 'logJoinLeaves'
                        }
                    )) ?? false
                await interaction.reply({
                    content:
                        i18next.t(
                            'settings.CURRENT_MODLOG_EVENTS_ENABLED_DISABLED',
                            {
                                event: 'message',
                                toggle: booleanToHuman(
                                    currentlogMessagesSetting
                                ),
                            }
                        ) +
                        '\n' +
                        i18next.t(
                            'settings.CURRENT_MODLOG_EVENTS_ENABLED_DISABLED',
                            {
                                event: 'member',
                                toggle: booleanToHuman(
                                    currentLogMembersSetting
                                ),
                            }
                        ) +
                        '\n' +
                        i18next.t(
                            'settings.CURRENT_MODLOG_EVENTS_ENABLED_DISABLED',
                            {
                                event: 'server',
                                toggle: booleanToHuman(currentLogServerSetting),
                            }
                        ) +
                        '\n' +
                        i18next.t(
                            'settings.CURRENT_MODLOG_EVENTS_ENABLED_DISABLED',
                            {
                                event: 'join/leave',
                                toggle: booleanToHuman(
                                    currentLogJoinLeavesSetting
                                ),
                            }
                        ),
                })
            } else {
                let response = ''
                if (typeof logMessages == 'boolean') {
                    await setGuildSetting(
                        interaction.guild.id,
                        {
                            group: 'modlog',
                            name: 'logMessages',
                            value: logMessages
                        }
                    )
                    response += i18next.t(
                        'settings.SET_MODLOG_EVENTS_ENABLED_DISABLED_SUCCESS',
                        {
                            event: 'message',
                            toggle: booleanToHuman(logMessages),
                        }
                    )
                }
                if (typeof logMembers == 'boolean') {
                    await setGuildSetting(
                        interaction.guild.id,
                        {
                            group: 'modlog',
                            name: 'logServer',
                            value: logServer
                        }
                    )
                    response +=
                        '\n' +
                        i18next.t(
                            'settings.SET_MODLOG_EVENTS_ENABLED_DISABLED_SUCCESS',
                            {
                                event: 'member',
                                toggle: booleanToHuman(logMembers),
                            }
                        )
                }
                if (typeof logServer == 'boolean') {
                    await setGuildSetting(
                        interaction.guild.id,
                        {
                            group: 'modlog',
                            name: 'logServer',
                            value: logServer
                        }
                    )
                    response +=
                        '\n' +
                        i18next.t(
                            'settings.SET_MODLOG_EVENTS_ENABLED_DISABLED_SUCCESS',
                            {
                                event: 'server',
                                toggle: booleanToHuman(logServer),
                            }
                        )
                }
                if (typeof logJoinLeaves == 'boolean') {
                    await setGuildSetting(
                        interaction.guild.id,
                        {
                            group: 'modlog',
                            name: 'logJoinLeaves',
                            value: logJoinLeaves
                        }
                    )
                    response +=
                        '\n' +
                        i18next.t(
                            'settings.SET_MODLOG_EVENTS_ENABLED_DISABLED_SUCCESS',
                            {
                                event: 'join/leave',
                                toggle: booleanToHuman(logJoinLeaves),
                            }
                        )
                }
                await interaction.reply({content: response})
                return
            }
        }
    } else if (subCommandGroup == 'roles') {
        let allowedRoles: Array<string> = await getGuildSetting(
            interaction.guild.id,
            {
                group: 'assignableRoles',
                name: 'allowedRoles'
            }
        )
        if (!allowedRoles) allowedRoles = []
        if (subCommand == 'allow') {
            const role = interaction.options.getRole('role')
            if (allowedRoles.includes(role.id)) {
                return interaction.reply({
                    content: i18next.t('settings.ROLE_ALREADY_ALLOWED', {
                        role: role.name,
                    }),
                    ephemeral: true,
                })
            }
            if (role.managed) {
                return interaction.reply({
                    content: i18next.t('settings.ROLE_IS_MANAGED'),
                    ephemeral: true,
                })
            }
            if (role.position > interaction.guild.me.roles.highest.position) {
                return interaction.reply({
                    content: i18next.t('settings.ROLE_HIGHER_THAN_ME'),
                    ephemeral: true,
                })
            }
            allowedRoles.push(role.id)
            await setGuildSetting(
                interaction.guild.id,
                {
                    group: 'assignableRoles',
                    name: 'allowedRoles',
                    value: allowedRoles
                }
            )
            await interaction.reply({
                content: i18next.t('settings.ROLE_ADDED_TO_ALLOW_LIST', {
                    role: role.name,
                }),
            })
        } else if (subCommand == 'disallow') {
            const role = interaction.options.getRole('role')
            if (!allowedRoles.includes(role.id)) {
                return interaction.reply({
                    content: i18next.t('settings.ROLE_NOT_ON_ALLOW_LIST', {
                        role: role.name,
                    }),
                    ephemeral: true,
                })
            }
            allowedRoles = removeItemFromArray(allowedRoles, role.id)
            await setGuildSetting(
                interaction.guild.id,
                {
                    group: 'assignableRoles',
                    name: 'allowedRoles',
                    value: allowedRoles
                }
            )
            await interaction.reply({
                content: i18next.t('settings.ROLE_REMOVED_FROM_ALLOW_LIST', {
                    role: role.name,
                }),
            })
        } else if (subCommand == 'list') {
            let allowListFormatted = ''
            if (allowedRoles.length) {
                for (const roleId of allowedRoles) {
                    const role = await interaction.guild.roles.fetch(roleId)
                    allowListFormatted += role.name + ', '
                }
                allowListFormatted = allowListFormatted.substring(
                    0,
                    allowListFormatted.length - 2
                )
            } else {
                allowListFormatted = i18next.t(
                    'settings.NO_ROLES_ON_ALLOW_LIST'
                )
            }
            await interaction.reply({
                content: i18next.t('settings.ROLES_ON_ALLOW_LIST', {
                    roles: allowListFormatted,
                }),
            })
        }
    }
}

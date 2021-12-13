import { Channel, CommandInteraction, Guild, GuildChannel, GuildMember, Message, MessageEmbed, TextChannel, User, } from 'discord.js'
import { BotClient, Permissions } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { registerSlashCommands } from '../../functions/registerCommands'
import i18next from 'i18next'
import { getGuildSetting, setGuildSetting } from '../../functions/db'

export const name = 'util'
export const description = 'Various util commands'
export const permissions: Permissions = ['OWNER']
export const usage = 'util thing'
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addSubcommandGroup(group =>
        group.setName('db')
            .setDescription('DB related commands')
            .addSubcommand(command =>
                command.setName('getguildsetting')
                    .setDescription('Gets the value of a setting in a guild')
                    .addStringOption(option =>
                        option.setName('guildid')
                            .setDescription('Guild ID to get the setting for')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('setting')
                            .setDescription('Setting to get')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('group')
                            .setDescription('Setting group to use')
                    )
            )
            .addSubcommand(command =>
                command.setName('setguildsetting')
                    .setDescription('Sets the value of a setting in a guild')
                    .addStringOption(option =>
                        option.setName('guildid')
                            .setDescription('Target guild ID')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('setting')
                            .setDescription('Setting to get')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('value')
                            .setDescription('Value to set the setting')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('group')
                            .setDescription('Setting group to use')
                    )
            )
    )
    .addSubcommandGroup(group =>
        group.setName('lookup')
            .setDescription('Commands to lookup various things')
            .addSubcommand(command =>
                command.setName('guild')
                    .setDescription('Shows information about a guild')
                    .addStringOption(option =>
                        option.setName('id')
                            .setDescription('Guild ID')
                            .setRequired(true)
                    )
            )
            .addSubcommand(command =>
                command.setName('user')
                    .setDescription('Shows information about a user')
                    .addStringOption(option =>
                        option.setName('id')
                            .setDescription('User ID')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('guildid')
                            .setDescription('Guild ID')
                            .setRequired(false)
                    )
                    .addBooleanOption(option =>
                        option.setName('showpermissions')
                            .setDescription('Whether to show member permissions')
                            .setRequired(false)
                    )
            )
            .addSubcommand(command =>
                command.setName('channel')
                    .setDescription('Shows information about a channel')
                    .addStringOption(option =>
                        option.setName('id')
                            .setDescription('Channel ID')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('guildid')
                            .setDescription('Guild ID')
                            .setRequired(false)
                    )
            )
    )
    .addSubcommandGroup(group =>
        group.setName('misc')
            .setDescription('Misc commands')
            .addSubcommand(command =>
                command.setName('deployslash')
                    .setDescription('Deploys slash commands')
            )
            .addSubcommand(command =>
                command.setName('shutdown')
                    .setDescription('Shuts down the bot')
            )
            .addSubcommand(command =>
                command.setName('say')
                    .setDescription('Sends a message in a certain channel')
                    .addStringOption(option =>
                        option.setName('message')
                            .setDescription('Message to send')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('channelid')
                            .setDescription('Channel ID to send the message in')
                            .setRequired(false)
                    )
                    .addStringOption(option =>
                        option.setName('messageid')
                            .setDescription('Message ID to reply to')
                            .setRequired(false)
                    )
            )
    )

function makeGetSetSettingEmbed(options: { guildId: string, group?: string, setting: string, value?: string, type: 'SET_SETTING' | 'GET_SETTING' }) {
    const { guildId, group, setting, value, type } = options
    const embedTitle = type == 'SET_SETTING' ? i18next.t('util.SET_SETTING_TITLE') : i18next.t('util.GET_SETTING_TITLE')
    const embed = new MessageEmbed()
        .setTitle(embedTitle)
        .addField(i18next.t('util.GUILD_ID'), guildId, true)
    group && embed.addField(i18next.t('util.SETTING_GROUP'), group, true)
    embed.addField(i18next.t('util.SETTING'), setting, true)
    value && embed.addField(i18next.t('util.VALUE'), value, true)
    return embed
}

export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    return
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    switch (interaction.options.getSubcommandGroup()) {
        case 'db': {
            switch (interaction.options.getSubcommand()) {
                case 'setguildsetting': {
                    const guildId = interaction.options.getString('guildid')
                    const group = interaction.options.getString('group')
                    const setting = interaction.options.getString('setting')
                    const value = interaction.options.getString('value')
                    try {
                        await setGuildSetting(guildId, { setting: setting, group: group, value: value })
                    } catch (err) {
                        const embed = new MessageEmbed()
                        embed.setDescription(i18next.t('general:UNKNOWN_ERROR'))
                        await interaction.reply({ embeds: [embed] })
                        return
                    }
                    const embed = makeGetSetSettingEmbed({
                        guildId: guildId,
                        group: group,
                        setting: setting,
                        value: value,
                        type: 'SET_SETTING'
                    })
                    await interaction.reply({ embeds: [embed] })
                    break
                }
                case 'getguildsetting': {
                    const guildId = interaction.options.getString('guildid')
                    const group = interaction.options.getString('group')
                    const setting = interaction.options.getString('setting')
                    const value = await getGuildSetting(guildId, { group: group, setting: setting })
                    const embed = makeGetSetSettingEmbed({
                        guildId: guildId,
                        group: group,
                        setting: setting,
                        value: value,
                        type: 'GET_SETTING'
                    })
                    await interaction.reply({ embeds: [embed] })
                    break
                }
            }
            break
        }
        case 'lookup': {
            switch (interaction.options.getSubcommand()) {
                case 'guild': {
                    const guildId = interaction.options.getString('id')
                    let guild: Guild
                    try {
                        guild = await interaction.client.guilds.fetch(guildId)
                    } catch {
                        return interaction.reply({ content: 'Error getting guild', ephemeral: true })
                    }
                    if (!guild) return interaction.reply({ content: 'Guild not found', ephemeral: true })
                    if (!guild.available) return interaction.reply({ content: 'Guild not avaliable', ephemeral: true })
                    const guildOwner = await guild.fetchOwner()
                    let botPermissions = guild.me.permissions.toArray().join(', ')
                    botPermissions = botPermissions ? botPermissions.substring(0, botPermissions.length) : 'NONE'
                    if (botPermissions.includes('ADMINISTRATOR,')) botPermissions = 'ADMINISTRATOR'
                    const embed = new MessageEmbed
                    embed.setTitle('Guild Lookup')
                        .setAuthor(guild.name, guild.iconURL())
                        .addField('Name', guild.name, true)
                        .addField('ID', guild.id, true)
                        .addField('Created At', guild.createdAt.toUTCString(), true)
                    guild.description && embed.addField('Guild Description', guild.description, true)
                    embed.addField('Owner Tag', guildOwner.user.tag, true)
                        .addField('Owner ID', guildOwner.user.id, true)
                        .addField('Member Count', String(guild.memberCount ?? guild.approximateMemberCount ?? 'Couldn\'t fetch'), true)
                        .addField('Partnered', String(guild.partnered).toUpperCase(), true)
                        .addField('Verified', String(guild.verified).toUpperCase(), true)
                        .addField('Premium Tier', guild.premiumTier, true)
                    guild.vanityURLCode && embed.addField('Vanity URL Code', guild.vanityURLCode, true)
                    embed.addField('Preferred Locale', guild.preferredLocale, true)
                        .addField('Bot Permissions', `\`${botPermissions}\``, false)
                        .addField('Shard ID', String(guild.shardId), true)
                    await interaction.reply({ embeds: [embed] })
                    break
                }
                case 'user': {
                    const userId = interaction.options.getString('id')
                    const guildId = interaction.options.getString('guildid')
                    let user: User
                    try {
                        user = await interaction.client.users.fetch(userId)
                    } catch {
                        await interaction.reply({ content: 'Error fetching user', ephemeral: true })
                        return
                    }
                    const embed = new MessageEmbed
                    const embeds = []
                    let userFlags = user.flags.toArray().join(', ')
                    userFlags = userFlags ? userFlags.substring(0, userFlags.length) : 'NONE'
                    embed.setTitle('User Lookup')
                        .setAuthor(user.tag, user.avatarURL() ?? user.defaultAvatarURL)
                        .addField('Tag', user.tag, true)
                        .addField('ID', user.id, true)
                        .addField('Bot', String(user.bot).toUpperCase(), true)
                        .addField('Created At', user.createdAt.toUTCString(), true)
                        .addField('Flags', `\`${userFlags}\``, true)
                    embeds.push(embed)
                    if (guildId) {
                        const memberEmbed = new MessageEmbed
                        memberEmbed.setTitle('Member Lookup')
                        let guild: Guild
                        try {
                            guild = await interaction.client.guilds.fetch(guildId)
                            // eslint-disable-next-line no-empty
                        } catch {
                        }
                        if (guild) {
                            if (guild.available) {
                                let member: GuildMember
                                try {
                                    member = await guild.members.fetch(userId)
                                    // eslint-disable-next-line no-empty
                                } catch {
                                }
                                if (member) {
                                    memberEmbed.setAuthor(member.nickname ?? user.tag, member.displayAvatarURL() ?? user.defaultAvatarURL)
                                    const showPermissions = interaction.options.getBoolean('showpermissions')
                                    const isGuildOwner = guild.ownerId == userId
                                    let memberPermissions = member.permissions.toArray().join(', ')
                                    memberPermissions = memberPermissions ? memberPermissions.substring(0, memberPermissions.length) : 'NONE'
                                    memberEmbed.addField('Nickname', member.nickname, true)
                                        .addField('Premium Since', member.premiumSince ? member.premiumSince.toUTCString() : 'N/A', true)
                                        .addField('Manageable', String(member.manageable).toUpperCase(), true)
                                    isGuildOwner && memberEmbed.addField('Guild Owner', 'TRUE', true)
                                    showPermissions && memberEmbed.addField('Permissions', `\`${memberPermissions}\``, true)
                                    !member.manageable && memberEmbed.addField('Highest Role Position', String(member.roles?.highest?.position) || 'N/A', true)
                                    !member.manageable && memberEmbed.addField('Bot Highest Role Position', String(guild.me.roles?.highest?.position) || 'N/A', true)
                                } else {
                                    memberEmbed.addField('Guild Member', 'Error fetching', false)
                                }
                            } else {
                                memberEmbed.addField('Guild', 'Not avaliable', false)
                            }
                        } else {
                            memberEmbed.addField('Guild', 'Error fetching', false)
                        }
                        embeds.push(memberEmbed)
                    }
                    await interaction.reply({ embeds: embeds })
                    break
                }
                case 'channel': {
                    const channelId = interaction.options.getString('id')
                    const guildId = interaction.options.getString('guildid')
                    let channel: Channel
                    try {
                        channel = await interaction.client.channels.fetch(channelId)
                        // eslint-disable-next-line no-empty
                    } catch {
                    }
                    if (!channel) {
                        await interaction.reply({ content: 'Error fetching channel', ephemeral: true })
                        return
                    }
                    const embed = new MessageEmbed
                    embed.setTitle('Channel Lookup')
                    let guildChannel: GuildChannel
                    if (guildId) {
                        let guild: Guild
                        try {
                            guild = await interaction.client.guilds.fetch(guildId)
                            // eslint-disable-next-line no-empty
                        } catch {
                        }
                        if (guild) {
                            guildChannel = await guild.channels.fetch(channelId)
                            embed.addField('Name', guildChannel.name, true)
                        }
                    }
                    embed.addField('ID', channel.id, true)
                    if (guildChannel) {
                        embed.addField('Guild ID', guildChannel.guild.id, true)
                    }
                    embed.addField('Type', channel.type, true)
                        .addField('Created At', channel.createdAt.toUTCString(), true)
                    if (guildChannel) {
                        guildChannel.parent && embed.addField('Category Name', guildChannel.parent.name, true)
                        embed.addField('Manageable', String(guildChannel.manageable).toUpperCase(), true)
                            .addField('Viewable', String(guildChannel.viewable).toUpperCase(), true)
                    }
                    await interaction.reply({ embeds: [embed] })
                    break
                }
            }
            break
        }
        case 'misc': {
            switch (interaction.options.getSubcommand()) {
                case 'deployslash': {
                    await interaction.deferReply()
                    await registerSlashCommands(client)
                    await interaction.editReply({ content: i18next.t('util.RELOADED_SLASH_COMMANDS') })
                    break
                }

                case 'shutdown': {
                    await interaction.reply(i18next.t('shutdown.SHUTTING_DOWN'))
                    // @ts-expect-error
                    process.emit('SIGINT')
                    break
                }
                case
                    'say': {
                        const thingToSay = interaction.options.getString('message')
                        const messagetoReplyToID = interaction.options.getString('messageid')
                        let channel: TextChannel
                        try {
                            // @ts-expect-error
                            channel = await interaction.client.channels.fetch(interaction.options.getString('channelid') ?? interaction.channel.id)
                        } catch {
                            await interaction.reply({ content: 'Error fetching channel', ephemeral: true })
                            return
                        }
                        if (channel.isText) {
                            if (!messagetoReplyToID) {
                                try {
                                    await channel.send(thingToSay)
                                } catch {
                                    await interaction.reply({ content: 'Error sending message in channel' })
                                    return
                                }
                            } else {
                                try {
                                    const message = await channel.messages.fetch(messagetoReplyToID)
                                    message.reply(thingToSay)
                                } catch {
                                    await interaction.reply({ content: 'Error sending message in channel' })
                                    return
                                }
                            }
                            await interaction.reply({
                                content: 'Successfully sent message',
                                ephemeral: interaction.channel.id == channel.id
                            })
                        } else {
                            await interaction.reply({ content: 'Specified channel wasn\'t a text channel', ephemeral: true })
                        }
                        break
                    }
            }
            break
        }
    }
}

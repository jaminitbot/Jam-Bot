import { CommandInteraction, Message, VoiceChannel } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { getChannelFromString } from '../../functions/util'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'
import { ChannelType } from 'discord-api-types'

export const name = 'move'
export const description = 'Moves users from one vc to another'
export const permissions = ['MOVE_MEMBERS']
export const usage = 'move #fromvc #tovc'
export const aliases = ['movevc']
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addChannelOption((option) =>
        option
            .setName('from')
            .setDescription('The channel to move users from')
            .addChannelType(ChannelType.GuildVoice)
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName('to')
            .setDescription('The channel to move users to')
            .addChannelType(ChannelType.GuildVoice)
            .setRequired(true)
    )

async function moveVoiceChannel(
    client: BotClient,
    fromChannel: VoiceChannel,
    toChannel: VoiceChannel,
    guildId: string,
    intiatingTag: string
) {
    if (!fromChannel || !toChannel)
        return i18next.t('move.ARGUMENTS_NOT_SPECIFIED')
    if (!toChannel.guild.me.permissions.has('MOVE_MEMBERS'))
        return i18next.t('general:BOT_INVALID_PERMISSION', {
            friendlyPermissionName: 'move members',
            permissionName: permissions[0],
        })
    if (fromChannel.type != 'GUILD_VOICE' || toChannel.type != 'GUILD_VOICE')
        return i18next.t('general:INVALID_CHANNEL_TYPE', {
            count: 2,
            correctType: 'voice',
        })
    if (fromChannel.guild.id != guildId || toChannel.guild.id != guildId)
        return i18next.t('move.CHANNELS_NOT_IN_GUILD')
    let count = 0
    try {
        fromChannel.members.each((member) => {
            count++
            member.voice.setChannel(
                toChannel,
                i18next.t('move.AUDIT_REASON', {
                    fromChannel: fromChannel.name,
                    toChannel: toChannel.name,
                    initiatedUserTag: intiatingTag,
                })
            )
        })
        if (count == 0) {
            return i18next.t('move.NO_USERS_MOVED')
        }
    } catch (err) {
        client.logger.warn('moveCommand: Potentional error: ' + err)
        return i18next.t('general:UNKNOWN_ERROR')
    }
    return i18next.t('move.SUCCESS_MOVED_USERS', {
        numberOfUsers: count,
        fromChannel: fromChannel.name,
        toChannel: toChannel.name,
    })
}

export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    //@ts-expect-error
    const fromChannel: VoiceChannel = await getChannelFromString(
        message.guild,
        args[0]
    )
    //@ts-expect-error
    const toChannel: VoiceChannel = await getChannelFromString(
        message.guild,
        args[1]
    )
    const result = await moveVoiceChannel(
        client,
        fromChannel,
        toChannel,
        message.guild.id,
        message.author.tag
    )
    message.channel.send(result)
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    await interaction.deferReply()
    // @ts-expect-error
    const fromChannel: VoiceChannel = interaction.options.getChannel('from')
    // @ts-expect-error
    const toChannel: VoiceChannel = interaction.options.getChannel('to')
    const result = await moveVoiceChannel(
        client,
        fromChannel,
        toChannel,
        interaction.guild.id,
        interaction.user.tag
    )
    await interaction.editReply(result)
}

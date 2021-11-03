import { CommandInteraction, Message, TextBasedChannels } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

import messages = require('../../functions/messages')
import isNumber = require('is-number')

export const name = 'purge'
export const description = 'Bulk deletes messages'
export const permissions = ['MANAGE_MESSAGES']
export const usage = 'purge 10'
export const aliases = ['massdelete']
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addIntegerOption((option) =>
        option
            .setName('number')
            .setDescription('The number of messages to delete')
            .setRequired(true)
    )
export const slashCommandOptions = [
    {
        name: 'number',
        type: 'INTEGER',
        description: 'The number of messages to purge',
        required: true,
    },
]
async function bulkDeleteMessages(
    channel: TextBasedChannels,
    NumOfMessagesToDelete
) {
    if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') return
    if (!channel.guild.me.permissions.has(['MANAGE_MESSAGES']))
        return i18next.t('general:BOT_INVALID_PERMISSION', {
            friendlyPermissionName: 'manage messages',
            permissionName: permissions[0],
        })
    const deleteCount = parseInt(NumOfMessagesToDelete)
    if (deleteCount < 1) {
        return i18next.t('purge.DELETE_COUNT_TOO_LOW')
    } else if (deleteCount > 100) {
        // Discord api doesn't let us do more than 100
        return i18next.t('purge.DELETE_COUNT_TOO_HIGH')
    }
    await channel.bulkDelete(deleteCount).catch((error) => {
        return messages.getErrorMessage()
    })
    return i18next.t('purge.DELETE_SUCCESSFUL', { count: deleteCount })
}
export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    if (!args[0])
        return message.reply(i18next.t('purge.NO_ARGUMENTS_SPECIFIED'))
    if (!isNumber(args[0]))
        return message.reply(i18next.t('purge.DELETE_COUNT_INVALID'))
    await message.delete()
    const sentMessage = await message.channel.send(
        await bulkDeleteMessages(message.channel, args[0])
    )
    setTimeout(() => {
        sentMessage.delete()
    }, 3 * 1000)
}
export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    const numOfMessages = interaction.options.getInteger('number')
    await interaction.reply({
        content: await bulkDeleteMessages(interaction.channel, numOfMessages),
        ephemeral: true,
    })
}

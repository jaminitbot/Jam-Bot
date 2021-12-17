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

async function bulkDeleteMessages(
    channel: TextBasedChannels,
    NumOfMessagesToDelete: number
) {
    if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') return
    if (!channel.guild.me.permissions.has(['MANAGE_MESSAGES']))
        return i18next.t('general:BOT_INVALID_PERMISSION', {
            friendlyPermissionName: 'manage messages',
            permissionName: permissions[0],
        })
    const deleteCount = NumOfMessagesToDelete
    if (deleteCount < 1) {
        return i18next.t('purge.DELETE_COUNT_TOO_LOW')
    } else if (deleteCount > 100) {
        // Discord api doesn't let us do more than 100
        return i18next.t('purge.DELETE_COUNT_TOO_HIGH')
    }
    await channel.bulkDelete(deleteCount).catch(() => {
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
    if (!isNumber(args[0])) {
        await message.reply(i18next.t('purge.DELETE_COUNT_INVALID'))
        return
    }
    await message.delete()
    const sentMessage = await message.channel.send(
        // @ts-expect-error
        await bulkDeleteMessages(message.channel, args[0])
    )
    try {
        setTimeout(async () => {
            await sentMessage.delete()
        }, 3 * 1000)
    } catch {
        return
    }

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

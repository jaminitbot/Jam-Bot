import { CommandInteraction, Message } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

export const name = 'shutdown'
export const description = 'Gracefully shuts down the bot'
export const usage = 'shutdown'
export const aliases = ['off', 'logoff']
export const permissions = ['OWNER']
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    await message.channel.send(i18next.t('shutdown.SHUTTING_DOWN'))
    // @ts-expect-error
    process.emit('SIGINT')
}
export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    await interaction.reply(i18next.t('shutdown.SHUTTING_DOWN'))
    // @ts-expect-error
    process.emit('SIGINT')
}

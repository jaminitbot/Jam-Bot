import { CommandInteraction, Message } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { searchForImage } from './image'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

export const name = 'gif'
export const description = 'Searches the internet for a gif'
export const usage = 'gif hello'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) =>
        option
            .setName('search')
            .setDescription('The search term')
            .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName('position')
            .setDescription('The specific position to get')
            .setRequired(false)
    )
export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    if (!args[0])
        return message.reply(i18next.t('image.NO_ARGUMENTS_SPECIFIED'))
    const sentMessage = await message.channel.send(
        i18next.t('image.SEARCH_LOADING')
    )
    const search = args.join(' ') + ' gif'
    // @ts-expect-error
    const isNsfw = message.channel.nsfw
    const imageUrl = await searchForImage(search, 0, isNsfw, client.logger)
    await sentMessage.edit(imageUrl)
}
export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    await interaction.deferReply()
    const search = interaction.options.getString('search') + ' gif'
    const position = interaction.options.getInteger('position') || null
    // @ts-expect-error
    const isNsfw = interaction.channel.nsfw
    const imageUrl = await searchForImage(
        search,
        position,
        isNsfw,
        client.logger
    )
    await interaction.editReply(imageUrl)
}

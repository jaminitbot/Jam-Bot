import { CommandInteraction, Guild, Message, User } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { request } from 'undici'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getLogger } from '../../functions/util'
import Sentry from '../../functions/sentry'
import i18next from 'i18next'

const logger = getLogger()
export const name = 'stock'
export const description = 'Searches Pexels for a stock image'
export const usage = 'stock nature'
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) =>
        option
            .setName('search')
            .setDescription('The term to search for')
            .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName('position')
            .setDescription('The specific position to get')
            .setRequired(false)
    )

interface PhotosObject {
    id: number
    width: number
    height: number
    url: string
    photographer: string
    photographer_url: string
    photographer_id: number
    avg_color: string
    src: {
        original: string
        large2x: string
        large: string
        medium: string
        small: string
        portrait: string
        landscape: string
        tiny: string
    }
    liked: boolean
}
interface PexelsResponse {
    page: number
    per_page: number
    photos: Array<PhotosObject>
}
export async function getStockImage(
    search: string,
    position: number,
    user: User,
    guild: Guild,
    type: string
) {
    if (!process.env.pexelsApiKey) return
    const response = await request(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            search
        )}&per_page=100`,
        {
            method: 'GET',
            headers: {
                Authorization: process.env.pexelsApiKey,
            },
        }
    )
    if (response.statusCode != 200) {
        logger.warn('stock: Pexels returned non-standard status code')
        Sentry.captureMessage('Pexels is returning non-standard status codes')
        return i18next.t('general:API_ERROR')
    }
    const json: PexelsResponse = await response.body.json()
    const photoPosition = position ?? 1
    if (1 > position || position > json.photos.length) {
        return i18next.t('image.NO_IMAGE_FOR_POSITION', { position: position })
    }
    const image = json.photos[photoPosition - 1].src.medium // eslint-disable-line no-undef
    return image || i18next.t('general:API_ERROR')
}
export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    if (!args[0])
        return message.reply(i18next.t('image.NO_ARGUMENTS_SPECIFIED'))
    const sent = await message.channel.send(i18next.t('image.SEARCH_LOADING'))
    const search = args.join(' ')
    await sent.edit(
        await getStockImage(search, 1, message.author, message.guild, 'prefix')
    )
}
export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    await interaction.deferReply()
    const search = interaction.options.getString('search')
    const position = interaction.options.getInteger('position') ?? 1
    await interaction.editReply(
        await getStockImage(
            search,
            position,
            interaction.user,
            interaction.guild,
            'slash'
        )
    )
}

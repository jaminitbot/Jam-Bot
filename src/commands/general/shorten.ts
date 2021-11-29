import { CommandInteraction, Message } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { request } from 'undici'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

export const name = 'shorten'
export const description = 'Shortens a URL'
export const usage = 'shorten https://google.com'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) =>
        option
            .setName('url')
            .setDescription('The URL to shorten')
            .setRequired(true)
    )

const urlRegex = new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/
)

async function shortenUrl(url: string) {
    if (url.match(urlRegex)) {
        const data = await (
            await request(
                'https://is.gd/create.php?format=json&url=' +
                encodeURIComponent(url)
            )
        ).body.json()
        return data.shorturl ? `<${data.shorturl}>` : null
    } else {
        return i18next.t('shorten.INVALID_URL')
    }
}

export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    if (!args[0])
        return message.reply(i18next.t('shorten.NO_ARGUMENTS_SPECIFIED'))
    await message.channel.send(
        (await shortenUrl(String(args[0]))) || i18next.t('general:API_ERROR')
    )
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    let url = interaction.options.getString('url')
    url = await shortenUrl(url)
    let userOnly = false
    if (!url) {
        url = i18next.t('general:API_ERROR')
        userOnly = true
    }
    await interaction.reply({
        content: url,
        ephemeral: userOnly,
        allowedMentions: {parse: []},
    })
}

import { CommandInteraction, Message } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { request } from 'undici'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

export const name = 'koala'
export const description = 'Gets a random image of a koala'
export const usage = 'koala'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
async function getKoalaImage() {
    const response = await request('https://some-random-api.ml/img/koala')
    if (response.statusCode != 200) return i18next.t('general:API_ERROR')
    return (await response.body.json()).link || i18next.t('general:API_ERROR')
}
export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    message.channel.send(await getKoalaImage())
}
export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    await interaction.deferReply()
    interaction.editReply(await getKoalaImage())
}

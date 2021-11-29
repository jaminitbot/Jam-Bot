import { CommandInteraction, Message } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { Dispatcher, request } from 'undici'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

export const name = 'dog'
export const description = 'Gets a random image of a dog'
export const usage = 'dog'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) =>
        option
            .setName('breed')
            .setDescription('The breed of the dog')
            .setRequired(false)
    )

async function getDogPhoto(breed: string | null) {
    let response: Dispatcher.ResponseData
    const breedArray = breed ? breed.trim().split(/ +/) : null
    if (!breed) {
        response = await request('https://dog.ceo/api/breeds/image/random')
    } else if (breedArray[1]) {
        response = await request(
            `https://dog.ceo/api/breed/${breedArray[1]}/${breedArray[0]}/images/random`
        )
    } else if (breedArray[0]) {
        response = await request(
            `https://dog.ceo/api/breed/${breedArray[0]}/images/random`
        )
    }
    if (response.statusCode != 200) return i18next.t('general:API_ERROR')
    return (
        (await response.body.json()).message || i18next.t('general:API_ERROR')
    )
}

export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    let data
    if (args[0]) {
        if (args[1]) {
            // Wants to get breed and sub breed
            data = await getDogPhoto(args[0] + ' ' + args[1])
        } else {
            // Just breed
            data = await getDogPhoto(String(args[0]))
        }
    } else {
        // Just random dog
        data = await getDogPhoto(null)
    }
    message.channel.send(data)
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    await interaction.deferReply()
    const breed = interaction.options.getString('breed') ?? null
    interaction.editReply(await getDogPhoto(breed))
}

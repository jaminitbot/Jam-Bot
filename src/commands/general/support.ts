import {
    MessageButton,
    Message,
    MessageEmbed,
    MessageActionRow,
    CommandInteraction,
} from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

export const name = 'support'
export const description = 'Displays support information'
export const usage = 'support'
export const allowInDm = false
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)

async function returnSupportEmbed() {
    const embed = new MessageEmbed()
    embed.setTitle(i18next.t('support.SUPPORT_TITLE'))
    embed.setDescription(i18next.t('support.SUPPORT_DESCRIPTION'))
    const row = new MessageActionRow()
    row.addComponents(
        new MessageButton()
            .setStyle('LINK')
            .setLabel(i18next.t('support.COMMAND_DOCS'))
            .setURL('https://jambot.jaminit.co.uk/#/'),
        new MessageButton()
            .setStyle('LINK')
            .setLabel(i18next.t('support.SUPPORT_SERVER'))
            .setURL('https://discord.gg/AP8ajhMBZK')
    )
    return [embed, row]
}
export async function execute(
    client: BotClient,
    message: Message,
    args: Array<unknown>
) {
    const embedObject = await returnSupportEmbed()
    message.channel.send({
        // @ts-expect-error
        embeds: [embedObject[0]],
        // @ts-expect-error
        components: [embedObject[1]],
    })
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    const embedObject = await returnSupportEmbed()
    // @ts-expect-error
    interaction.reply({
        embeds: [embedObject[0]],
        components: [embedObject[1]],
    })
}

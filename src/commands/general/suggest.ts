// TODO: Improve suggestions to allow for editing and implementation
import { CommandInteraction, Message, MessageEmbed, TextChannel, User, } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import { getGuildSetting, setGuildSetting } from '../../functions/db'
import { SlashCommandBuilder } from '@discordjs/builders'

import i18next from 'i18next'

export const name = 'suggest'
export const description = 'Suggests something'
export const usage = 'suggest Make a memes channel'
export const slashData = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) =>
        option
            .setName('suggestion')
            .setDescription('A description of your suggestion')
            .setRequired(true)
    )

async function sendSuggestion(
    client: BotClient,
    suggestion: string,
    guildId: string,
    attachment: string,
    author: User
) {
    const suggestionChannelId = await getGuildSetting(
        guildId,
        {
            group: 'suggestions',
            name: 'channel'
        }
    )
    if (!suggestionChannelId) return i18next.t('suggest.NO_SUGGESTION_CHANNEL') // Suggestions aren't setup yet
    if (!(await getGuildSetting(guildId, {group: 'suggestions', name: 'enabled'})))
        return i18next.t('suggest.SUGGESTIONS_DISABLED') // Suggestions are disabled
    // @ts-expect-error
    const suggestionChannel: TextChannel = await client.channels.fetch(
        suggestionChannelId
    )
    if (!suggestionChannel) return i18next.t('suggest.ERROR_FINDING_CHANNEL') // Error finding suggestions channel
    let suggestionCount = await getGuildSetting(
        guildId,
        {
            group: 'suggestions',
            name: 'suggestionCount'
        }
    )
    if (!suggestionCount) suggestionCount = 0
    suggestionCount = parseInt(suggestionCount)
    await setGuildSetting(
        guildId,
        {
            group: 'suggestions',
            name: 'suggestionCount',
            value: suggestionCount + 1
        }
    )
    const embed = new MessageEmbed()
    embed.setTitle(
        i18next.t('suggest.SUGGESTION_TITLE', {
            suggestionId: suggestionCount + 1,
        })
    )
    embed.addField(i18next.t('suggest.DESCRIPTION'), suggestion)
    if (attachment) {
        embed.setImage(attachment)
    }
    embed.setColor('#E9D985')
    embed.setFooter(
        i18next.t('suggest.SUGGESTION_FOOTER', {tag: author.tag}),
        author.displayAvatarURL()
    )
    embed.setTimestamp(Date.now())
    const suggestionMessage = await suggestionChannel.send({embeds: [embed]})
    try {
        await suggestionMessage.react('✅')
        suggestionMessage.react('❌')
    } catch {
        // Code
    }
    return i18next.t('suggest.SUGGESTION_SUCCESSFUL')
}

export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
    if (!args[0]) return message.reply(i18next.t('NO_ARGUMENTS_SPECFIED'))
    message.delete()
    const suggestionDescription = args.join(' ')
    const attachment = message.attachments.first()
        ? message.attachments.first().url
        : null
    const result = await sendSuggestion(
        client,
        suggestionDescription,
        message.guild.id,
        attachment,
        message.author
    )
    message.channel.send(result)
}

export async function executeSlash(
    client: BotClient,
    interaction: CommandInteraction
) {
    const suggestionDescription = interaction.options.getString('suggestion')
    const result = await sendSuggestion(
        client,
        suggestionDescription,
        interaction.guild.id,
        null,
        interaction.user
    )
    interaction.reply({content: result, ephemeral: true})
}

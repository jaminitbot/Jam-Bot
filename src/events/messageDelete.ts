import { Message, MessageEmbed } from 'discord.js'
import { BotClient } from '../customDefinitions'
import { inputSnipe } from '../functions/snipe'
import { postToModlog } from '../functions/mod'
import { isBotOwner } from '../functions/util'
import i18next from 'i18next'

export const name = 'messageDelete'

// https://coolors.co/aa8f66-ff0000-ffeedb-61c9a8-121619
export async function register(
    client: BotClient,
    message: Message
): Promise<void> {
    if (message.partial) return
    if (
        !(
            message.channel.type == 'GUILD_NEWS' ||
            message.channel.type == 'GUILD_TEXT'
        )
    )
        return
    if (message.author.bot) return
    await inputSnipe(message, null, 'delete')
    if (isBotOwner(message.author.id)) return
    //#region Delete log code
    const embed = new MessageEmbed()
    embed.setAuthor(message.author.tag, message.author.avatarURL())
    embed.addField(
        i18next.t('events:messageLogs.EMBED_TITLE', {
            channel: message.channel.name,
            type: 'deleted',
        }),
        message.content || i18next.t('events:messageLogs.NO_CONTENT'),
        false
    )
    embed.setColor('#FF0000')
    embed.setTimestamp(Date.now())
    embed.setFooter(
        i18next.t('events:messageLogs.EMBED_FOOTER', {
            userId: message.author.id,
            channelId: message.channel.id,
        })
    )
    await postToModlog(client, message.guild.id, {embeds: [embed]}, 'messages')
    //#endregion
}

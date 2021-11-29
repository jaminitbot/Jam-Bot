import { Guild } from 'discord.js'
import { BotClient } from '../customDefinitions'
import { registerSlashCommands } from '../functions/registerCommands'

export const name = 'guildCreate'

export async function generateGuildInfoEmbed(guild: Guild) {
    const owner = await guild.fetchOwner()
    return {
        title: 'Joined guild',
        description: `Guild Name: ${guild.name}
			Guild Id: ${guild.id}
			Created At: ${guild.createdAt}
			Description: ${guild.description}
			Owner: ${owner.user.tag}, ${owner.id}
			Members: ${guild.memberCount}
			Partnered: ${guild.partnered}
			Verified: ${guild.verified}`,
        color: '#20BE9D',
        timestamp: Date.now(),
    }
}

export async function register(client: BotClient, guild: Guild) {
    if (guild.id == process.env.devServerId) {
        await registerSlashCommands(client)
    }
    if (!process.env.guildLogChannel) return
    const channel = await guild.client.channels.fetch(
        process.env.guildLogChannel
    )
    if (!channel) return
    if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') return
    try {
        // @ts-expect-error
        channel.send({embeds: [await this.generateGuildInfoEmbed(guild)]})
        // eslint-disable-next-line no-empty
    } catch {
    }
}

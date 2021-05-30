import { Guild } from "discord.js"

export function generateGuildInfoEmbed(guild: Guild): Record<string, unknown> {
	return {
		title: 'Joined guild',
		description: `Guild Name: ${guild.name}
			Guild Id: ${guild.id}
			Created At: ${guild.createdAt}
			Description: ${guild.description}
			Owner: ${guild.owner.user.tag}, ${guild.owner.id}
			Members: ${guild.memberCount}
			Partnered: ${guild.partnered}
			Verified: ${guild.verified}`,
		color: '#20BE9D',
		timestamp: Date.now(),
	}
}
export default async function register(guild: Guild, logger) {
	await guild.client.channels.fetch(process.env.GuildLogChannel)
		// @ts-expect-error
		.send({ embed: this.generateGuildInfoEmbed(guild) })
}

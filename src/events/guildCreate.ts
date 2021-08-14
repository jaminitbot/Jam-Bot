import { Guild } from "discord.js"
export const name = "guildCreate"
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
export async function register(guild: Guild) {
	await guild.client.channels.fetch(process.env.guildLogChannel)
		// @ts-expect-error
		.send({ embed: await this.generateGuildInfoEmbed(guild) })
}

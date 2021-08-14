import { Guild } from "discord.js"
export const name = "guildDelete"

export async function register(guild: Guild) {
	await guild.client.channels.fetch(process.env.guildLogChannel)
		// @ts-expect-error
		.send(`Oh dear, we left ${guild.name}, ${guild.id}`)
}

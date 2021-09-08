import { Guild } from "discord.js"
export const name = "guildDelete"

export async function register(guild: Guild) {
	if (!process.env.guildLogChannel) return
	const channel = await guild.client.channels.fetch(process.env.guildLogChannel)
	if (!channel) return
	if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') return
	try {
		// @ts-expect-error
		channel.send(`Oh dear, we left ${guild.name}, ${guild.id}`)
		// eslint-disable-next-line no-empty
	} catch {

	}

}

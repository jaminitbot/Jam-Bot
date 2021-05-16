import { Guild } from "discord.js"


export default function register(guild: Guild) {
	guild.client.channels.cache
		.get(process.env.GuildLogChannel)
		// @ts-expect-error
		.send(`Oh dear, we left ${guild.name}, ${guild.id}`)
}

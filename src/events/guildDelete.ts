import { Guild } from "discord.js"

module.exports = {
	register(guild: Guild, db) {
		guild.client.channels.cache
			.get(process.env.GuildLogChannel)
			// @ts-expect-error
			.send(`Oh dear, we left ${guild.name}, ${guild.id}`)
	},
}

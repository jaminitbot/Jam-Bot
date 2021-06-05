import {Guild} from "discord.js"


export default async function register(guild: Guild) {
	await guild.client.channels.fetch(process.env.GuildLogChannel)
		// @ts-expect-error
		.send(`Oh dear, we left ${guild.name}, ${guild.id}`)
}

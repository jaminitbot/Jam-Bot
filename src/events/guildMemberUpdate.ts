import { GuildMember, PartialGuildMember } from "discord.js";
export const name = "guildMemberUpdate"

export async function register(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
	if (newMember.guild.id == '779060204528074783') {
		if (oldMember.pending && !newMember.pending) {
			try {
				await newMember.roles.add(process.env.DEFAULT_ROLE)
				// eslint-disable-next-line no-empty
			} catch (err) {
				console.error(err)
			}

		}
	}

}
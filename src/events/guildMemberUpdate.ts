import { GuildMember, PartialGuildMember } from "discord.js"
import { BotClient } from "src/customDefinitions"
import { sendUserToModlog } from "./guildMemberAdd"

export async function register(client: BotClient, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
	if (oldMember.pending && !newMember.pending) {
		sendUserToModlog(client, newMember)
		if (newMember.guild.id == '779060204528074783') {
			try {
				await newMember.roles.add(process.env.DEFAULT_ROLE)
			} catch (err) {
				return
			}
		}
	}

}
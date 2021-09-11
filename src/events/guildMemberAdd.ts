import { GuildMember, MessageEmbed } from "discord.js"
import { BotClient } from "src/customDefinitions"
import { postToModlog } from "../functions/mod"
import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(duration)
dayjs.extend(relativeTime)

export const name = "guildMemberAdd"
export async function sendUserToModlog(client: BotClient, member: GuildMember) {
	const embed = new MessageEmbed
	embed.setAuthor(member.displayName, member.user.displayAvatarURL())
	embed.setTitle('User Joined')
	embed.setDescription(`User: <@${member.id}>\n` +
		`Created: ${dayjs.duration(member.user.createdTimestamp, 'ms').humanize()}` +
		`There is now: ${member.guild.memberCount} users`)
	embed.setFooter('User ID: ' + member.id)
	embed.setTimestamp(Date.now())
	postToModlog(client, member.guild.id, { embeds: [embed] }, 'joinLeaves')
}
export async function register(client: BotClient, member: GuildMember) {
	if (!member.pending) {
		sendUserToModlog(client, member)
		if (member.guild.id == '779060204528074783') {
			try {
				await member.roles.add(process.env.DEFAULT_ROLE)
				// eslint-disable-next-line no-empty
			} catch (err) {
				return
			}
		}
	}
}
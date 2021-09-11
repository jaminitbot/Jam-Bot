import { GuildMember, MessageEmbed } from "discord.js"
import { BotClient } from "src/customDefinitions"
import { postToModlog } from "../functions/mod"
import dayjs from "dayjs"
import relative from 'dayjs/plugin/relativeTime'
dayjs.extend(relative)

export const name = "guildMemberAdd"
export async function sendUserToModlog(client: BotClient, member: GuildMember) {
	const embed = new MessageEmbed
	embed.setAuthor(member.displayName, member.user.displayAvatarURL())
	embed.setTitle('User Joined')
	embed.setDescription(`User: <@${member.id}>\n` +
		`Created: ${dayjs().to(member.user.createdTimestamp)}\n` +
		`There is now: ${member.guild.memberCount} users`)
	embed.setFooter('User ID: ' + member.id)
	embed.setTimestamp(Date.now())
	embed.setFooter('#26C485')
	postToModlog(client, member.guild.id, { embeds: [embed] }, 'joinLeaves')
}
export async function register(client: BotClient, member: GuildMember) {
	if (member.partial) await member.fetch()
	sendUserToModlog(client, member)
}
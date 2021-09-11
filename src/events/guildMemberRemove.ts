import { GuildMember, MessageEmbed } from "discord.js"
import { BotClient } from "src/customDefinitions"
import { postToModlog } from "../functions/mod"

export async function register(client: BotClient, member: GuildMember) {
	const embed = new MessageEmbed
	embed.setAuthor(member.displayName, member.user.displayAvatarURL())
	embed.setTitle('User Left')
	embed.setDescription(`User: <@${member.id}>\n` +
		`There is now: ${member.guild.memberCount} users`)
	embed.setFooter('User ID: ' + member.id)
	embed.setTimestamp(Date.now())
	postToModlog(client, member.guild.id, { embeds: [embed] }, 'joinLeaves')
}
import {Message} from "discord.js"
import {getUserFromString} from './util'
/**
 * 
 * @param message Message object of initiating command
 * @param args Command arguments
 * @param kickOrBan kick or ban
 */
export default async function execute(message: Message, args: Array<string>, kickOrBan: string) {
	if (!args[0]) return message.reply(`usage: ${kickOrBan} @person reason`)
	if (!message.guild.me.hasPermission(['BAN_MEMBERS', 'KICK_MEMBERS'])) return message.channel.send(`I don't have permission to perform this command, check I can ${kickOrBan} people!`)
	const memberToBan = await getUserFromString(message.guild, args[0])
	if (!memberToBan) return message.reply("you didn't mention a valid user in this server!")
	if (memberToBan.id == process.env.ownerId) return message.channel.send('Ha no, no kick kick')
	if (message.author.id == memberToBan.id) return message.reply(`you can't ${kickOrBan} yourself silly!`)
	if (!memberToBan.manageable) return message.reply(`I can\'t ${kickOrBan} that user, their role is probably higher than mine :(`)
	const authorRolePosition = message.member.roles.highest.position
	const targetUserPosition = memberToBan.roles.highest.position
	if (authorRolePosition <= targetUserPosition) {
		return message.reply('You cannot ban someone who has a higher/equal role than you!')
	}
	const moderator = message.author.tag
	const reason = args.splice(1).join(' ') || 'Not Specified'
	if (kickOrBan == 'ban') {
		memberToBan
			.ban({ reason: `${moderator}: ${reason}`, days: 1 })
			.then((member) => {
				message.channel.send(`Poof, ${member} got the ${kickOrBan}!`)
			})
			.catch(() => {
				return message.channel.send(`Sorry, you can't ${kickOrBan} this member`)
			})
	} else {
		memberToBan
			.kick(`${moderator}: ${reason}`)
			.then((member) => {
				message.channel.send(`Poof, ${member} got the ${kickOrBan}!`)
			})
			.catch(() => {
				return message.channel.send(`Sorry, you can't ${kickOrBan} this member`)
			})
	}
}

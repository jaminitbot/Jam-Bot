import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
const messages = require('../functions/messages')

export const name = 'tell'
export const description = 'Tells something, to someone'
export const usage = 'tell @user You are amazing :))'
export function execute(client: client, message: Message, args, db, logger: Logger) {
	const user =
		message.mentions.members.first() ||
		message.guild.members.cache.get(args[0])
	if (!user) return message.reply('you need to mention a valid person!')
	if (!args[1])
		return message.reply('you need to say something to tell them')
	message.delete()
	const thingToSay = args.splice(1).join(' ')
	message.channel.send(`${thingToSay}, <@${user.id}>`, {
		allowedMentions: { parse: ['users'] },
	})
}

import {Message} from "discord.js"
import {client} from '../customDefinitions'
import {Logger} from "winston"
import {getUserFromString} from "../functions/util";

export const name = 'tell'
export const description = 'Tells something, to someone'
export const usage = 'tell @user You are amazing :))'
export async function execute(client: client, message: Message, args, logger: Logger) {
	const user = await getUserFromString(message.guild, args[0])
	if (!user) return message.reply('you need to mention a valid person!')
	if (!args[1]) return message.reply('you need to say something to tell them')
	await message.delete()
	const thingToSay = args.splice(1).join(' ')
	message.channel.send(`${thingToSay}, <@${user.id}>`, { allowedMentions: { parse: ['users'] }, })
}

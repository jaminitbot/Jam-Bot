import { Message, TextChannel } from "discord.js"
import { client } from '../customDefinitions'

export const name = 'say'
export const description = 'Say'
export const usage = 'say #general Hiiii'
export async function execute(client: client, message: Message, args) {
	if (message.author.id !== process.env.OWNERID) return
	await message.delete()
	// @ts-expect-error
	const channel: TextChannel = message.mentions.channels.first() || await client.channels.fetch(args[0])
	if (!channel)
		return message.reply('you need to specify a valid channel')
	if (!(channel.type == 'text' || channel.type == 'news')) return
	const thingToSay = args.splice(1).join(' ')
	channel.send(thingToSay)
}

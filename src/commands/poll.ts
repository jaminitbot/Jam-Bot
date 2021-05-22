import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
const delay = require('delay')

export const name = 'poll'
export const description = 'Creates a poll'
export const usage = 'poll Are chips good?'
export async function execute(client: client, message: Message, args, logger: Logger) {
	if (!args[0])
		return message.reply(
			'you need to specify what to make the poll about!'
		)
	message.delete()
	const text = args.splice(0).join(' ')
	let embed = {
		description: text,
		footer: {
			text: `A poll by ${message.author.tag}`,
			icon_url: message.member.user.avatarURL(),
		},
		timestamp: Date.now(),
	}
	const sent = await message.channel.send({ embed: embed })
	await sent.react('✅')
	await delay(1100)
	sent.react('❌')
}

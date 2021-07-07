import { Message, MessageEmbed } from "discord.js"
import { client } from '../customDefinitions'
import delay from 'delay'

export const name = 'poll'
export const description = 'Creates a poll'
export const usage = 'poll Are chips good?'
export async function execute(client: client, message: Message, args) {
	if (!args[0])
		return message.reply(
			'you need to specify what to make the poll about!'
		)
	await message.delete()
	const text = args.splice(0).join(' ')
	const embed = new MessageEmbed
	embed.setDescription(text)
	embed.setFooter(`A poll by ${message.author.tag}`, message.member.user.avatarURL())
	embed.setTimestamp(Date.now())
	embed.setColor('#167C6A')
	const sent = await message.channel.send(embed)
	await sent.react('✅')
	await delay(1100)
	sent.react('❌')
}

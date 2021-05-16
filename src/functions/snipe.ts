import { Message, TextChannel } from "discord.js"

const buffer = new Map<number, object>()
export async function inputSnipe(message: Message, type) {
	let messageObject = {
		channel: message.channel.id,
		content: message.content || null,
		user: message.author,
		attachments: message.attachments.first() || null,
		type: type
	}
	let id = Math.random()
	buffer.set(id, messageObject)
	setTimeout(() => buffer.delete(id), 10000)
}
export default function snipe(channel: TextChannel) {
	let snipes = Array.from(buffer.values())
	return snipes
}
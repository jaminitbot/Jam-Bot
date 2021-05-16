import { Message, TextChannel } from "discord.js"

const buffer = new Map<number, object>()
/**
 * 
 * @param message The message
 * @param oldMessage Old message (incase of message edits)
 * @param type Delete or edit
 */
export async function inputSnipe(message: Message, oldMessage, type) {
	if (!oldMessage) {
		oldMessage = {
			content: null
		}
	}
	let messageObject = {
		channel: message.channel.id,
		oldMessage: oldMessage.content || 'NONE',
		content: message.content || 'NONE',
		user: message.author,
		attachments: message.attachments.first() || null,
		type: type
	}
	let id = Math.random()
	buffer.set(id, messageObject)
	setTimeout(() => buffer.delete(id), 10000)
}
/**
 * 
 * @returns Array of sniped messages
 */
export default function snipe() {
	let snipes = Array.from(buffer.values())
	return snipes
}
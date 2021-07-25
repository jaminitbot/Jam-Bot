import {Message, MessageAttachment, User} from "discord.js"

export const snipeLifetime = 20

interface messageSniped {
	channel: string,
	oldMessage: string,
	content: string,
	user: User,
	attachments: MessageAttachment,
	type: string
}
const buffer = new Map<number, messageSniped>()
/**
 * 
 * @param message The message
 * @param oldMessage Old message (incase of message edits)
 * @param type Delete or edit
 */
export async function inputSnipe(message: Message, oldMessage: Message, type: string):Promise<void> {
	if (!oldMessage) {
		// @ts-expect-error
		oldMessage = {
			content: null
		}
	}
	const messageObject: messageSniped = {
		channel: message.channel.id,
		oldMessage: oldMessage.content || 'Message had no content',
		content: message.content || 'Message had no content',
		user: message.author,
		attachments: message.attachments.first() || null,
		type: type
	}
	const id = Math.random()
	buffer.set(id, messageObject)
	setTimeout(() => buffer.delete(id), snipeLifetime * 1000)
}
/**
 * 
 * @returns Array of sniped messages
 */
export function returnSnipedMessages(): Array<messageSniped> {
	return Array.from(buffer.values())
}
import { Message, User } from "discord.js"

export const snipeLifetime = 20

export interface MessageSniped {
	channel: string,
	oldMessage: string,
	newMessage: string,
	user: User,
	type: string
}
const buffer = new Map<number, MessageSniped>()
/**
 * 
 * @param message The message
 * @param oldMessage Old message (incase of message edits)
 * @param type Delete or edit
 */
export async function inputSnipe(message: Message, oldMessage: Message, type: string): Promise<void> {
	if (!oldMessage) {
		// @ts-expect-error
		oldMessage = {
			content: null
		}
	}
	const messageObject: MessageSniped = {
		channel: message.channel.id,
		oldMessage: oldMessage.content || 'Message had no content',
		newMessage: message.content || 'Message had no content',
		user: message.author,
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
export function returnSnipedMessages(): Array<MessageSniped> {
	return Array.from(buffer.values()).reverse()
}
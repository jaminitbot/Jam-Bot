import { Message, User } from "discord.js"
import {isBotOwner} from './util'

export const snipeLifetime = 20

export interface MessageSniped {
	channel: string,
	oldMessage: string,
	newMessage: string,
	user: User,
	type: string
	isOwner: boolean
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
	const isOwner = isBotOwner(message.author.id)
	const messageObject: MessageSniped = {
		channel: message.channel.id,
		oldMessage: oldMessage.content || '[No content]',
		newMessage: message.content || '[No content]',
		user: message.author,
		type: type,
		isOwner: isOwner
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
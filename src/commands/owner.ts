import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"

export const name = 'owner'
export const description = 'Displays the owner of the bot'
export const usage = 'owner'
export async function execute(client: client, message: Message, args, db, logger: Logger) {
	message.channel.send(process.env.OWNERNAME)
}

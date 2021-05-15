import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
import { getInvalidPermissionsMessage } from '../functions/messages'

export const name = 'eval'
export const description = 'Executes code'
export const usage = 'eval 1+1'
export async function execute(client: client, message: Message, args, logger: Logger) {

	if (message.author.id == process.env.OWNERID) {
		message.channel.send(String(await eval(args.splice(0).join(' '))))
	} else {
		message.channel.send(getInvalidPermissionsMessage())
	}
}

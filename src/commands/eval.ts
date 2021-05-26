import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
import { getInvalidPermissionsMessage } from '../functions/messages'

export const name = 'eval'
export const description = 'Executes code'
export const usage = 'eval 1+1'
export async function execute(client: client, message: Message, args, logger: Logger) {
	if (message.author.id == process.env.OWNERID) {
		let commandOutput
		try {
			commandOutput = await eval(args.splice(0).join(' '))
		} catch (error) {
			commandOutput = error
		}
		message.channel.send(String(commandOutput))
	} else {
		message.channel.send(getInvalidPermissionsMessage())
	}
}

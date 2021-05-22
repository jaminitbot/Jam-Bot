import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
import { setKey } from '../functions/db'

export const name = 'setkey'
export const description = 'Sets a db key'
export const usage = 'setkey blah test'
export async function execute(client: client, message: Message, args, logger: Logger) {
	if (!(message.author.id == process.env.OWNERID)) return
	const result: boolean = await setKey(message.guild.id, args[0], args[1])
	if (result) {
		message.channel.send(`Successfully set ${args[0]} to ${args[1]}`)
	} else {
		message.channel.send('Oops, that didn\'t work!')
	}
}

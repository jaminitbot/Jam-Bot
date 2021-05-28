import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
import { setKey } from '../functions/db'

export const name = 'setkey'
export const description = 'Sets a db key'
export const usage = 'setkey 46435456789132 blah test'
export async function execute(client: client, message: Message, args, logger: Logger) {
	if (message.author.id !== process.env.OWNERID) return
	if (!args[0]) return message.reply('You need to specify a guild ID')
	if (!args[1]) return message.reply('You need to specify a key to set')
	if (!args[2]) return message.reply('You need to specify a value to set')
	const result: boolean = await setKey(args[0], args[1], args[2])
	if (result) {
		message.channel.send(`Successfully set ${args[1]} to ${args[2]} in guild: ${args[0]}`)
	} else {
		message.channel.send('Oops, that didn\'t work!')
	}
}

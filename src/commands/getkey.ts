import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
import { getKey } from '../functions/db'

export const name = 'getkey'
export const description = 'Gets a db key'
export const usage = 'getkey 4569844357398443 blah'
export async function execute(client: client, message: Message, args, logger: Logger) {
	if (message.author.id !== process.env.OWNERID) return
	if (!args[0]) return message.reply('You need to specify a guild ID')
	if (!args[1]) return message.reply('You need to specify a key to get')
	message.channel.send((await getKey(args[0], args[1])) || 'null')
}

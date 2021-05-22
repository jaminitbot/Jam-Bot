import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
import { getKey } from '../functions/db'

export const name = 'getkey'
export const description = 'Gets a db key'
export const usage = 'getkey blah'
export async function execute(client: client, message: Message, args, logger: Logger) {
	if (!(message.author.id == process.env.OWNERID)) return
	if (!args[0]) return message.reply('You need to specify a key to get')
	message.channel.send(
		(await getKey(message.guild.id, args[0])) || 'null'
	)
}

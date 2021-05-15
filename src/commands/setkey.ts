import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"

export const name = 'setkey'
export const description = 'Sets a db key'
export const usage = 'setkey blah test'
export async function execute(client: client, message: Message, args, db, logger: Logger) {
	if (!(message.author.id == process.env.OWNERID)) return
	if (!args[0]) return message.reply('You need to specify a key to get')
	message.channel.send(
		(await db.get(message.guild.id, args[0])) || 'null'
	)
}

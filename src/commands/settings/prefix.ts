import { Message } from "discord.js"
import { Logger } from "winston"
import { client } from '../../custom'
import { setKey } from '../../functions/db'

export let name = 'prefix'
export let description = 'Sets the bot prefix'
export let usage = 'settings prefix $'
export function execute(client: client, message: Message, args, logger: Logger) {

	const prefix = args[1]
	if (!prefix)
		return message.channel.send(
			'You need to specify a prefix!\n' + this.usage
		)
	setKey(message.guild.id, 'prefix', prefix)
	message.channel.send("Updated prefix to '" + prefix + "'")
}

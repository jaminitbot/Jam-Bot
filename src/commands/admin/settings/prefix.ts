import { Message } from "discord.js"
import { client } from '../../../customDefinitions'
import { setKey } from '../../../functions/db'

export const name = 'prefix'
export const description = 'Sets the bot prefix'
export const usage = 'settings prefix $'
export function execute(client: client, message: Message, args) {

	const prefix = args[1]
	if (!prefix)
		return message.channel.send(
			'You need to specify a prefix!\n' + this.usage
		)
	setKey(message.guild.id, 'prefix', prefix)
	message.channel.send("Updated prefix to '" + prefix + "'")
}

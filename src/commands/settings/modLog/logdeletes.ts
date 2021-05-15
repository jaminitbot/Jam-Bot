import { client } from '../../../custom'
import { Message } from "discord.js"
import { Logger } from "winston"
import { setKey } from '../../../functions/db'

export let name = 'logdeletes'
export let description = 'Turns logging deletes on or off'
export let usage = 'settings modlog logdeletes on|off'
export async function execute(client: client, message: Message, args, logger: Logger) {

	const toggle = String(args[2]).toLowerCase()
	if (!toggle || !(toggle == 'on' || toggle == 'off')) {
		return message.channel.send(
			"You need to specify whether you want to toggle logging deletes 'on' or 'off'\n"
		)
	}
	if (toggle == 'on') {
		setKey(message.guild.id, 'logDeletedMessages', "true")
	} else {
		setKey(message.guild.id, 'logDeletedMessages', "false")
	}
	message.channel.send(`Turned logging deletes ${toggle}`)
}

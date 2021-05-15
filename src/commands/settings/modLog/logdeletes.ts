import { client } from '../../../custom'
import { Message } from "discord.js"
import { Logger } from "winston"

export let name = 'logdeletes'
export let description = 'Turns logging deletes on or off'
export let usage = 'settings modlog logdeletes on|off'
export async function execute(client: client, message: Message, args, db, logger: Logger) {
	const toggle = String(args[2]).toLowerCase()
	// @ts-expect-error
	if (!toggle || toggle !== 'on' || toggle !== 'off') {
		return message.channel.send(
			"You need to specify whether you want to toggle logging deletes 'on' or 'off'\n" +
			this.usage
		)
	}
	if (toggle == 'on') {
		db.updateKey(message.guild.id, 'logDeletedMessages', true)
	} else {
		db.updateKey(message.guild.id, 'logDeletedMessages', false)
	}
	message.channel.send(`Turned logging deletes ${toggle}`)
}

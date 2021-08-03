import {CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'

export const name = 'uptime'
export const description = "Displays the bot's current uptime"
export const usage = 'uptime'
export const allowInDm = true
export function execute(client: client, message: Message, args) {
	const TimeDate = new Date(Date.now() - client.uptime)
	message.channel.send(
		'The bot has been up since: ' + TimeDate.toString()
	)
}
export async function executeSlash(client, interaction:CommandInteraction) {
	const TimeDate = new Date(Date.now() - client.uptime)
	interaction.reply('The bot has been up since: ' + TimeDate.toString())
}

import { Message, MessageEmbed } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"

export const name = 'ping'
export const description = 'Displays various latency information'
export const usage = 'ping'
export async function execute(client: client, message: Message, args, logger: Logger) {
	message.react('🏓')
	const sent = await message.channel.send('Pong! 🏓')
	const embed = new MessageEmbed
	embed.setDescription(`:hourglass: ${sent.createdTimestamp - message.createdTimestamp}ms :stopwatch: ${Math.round(client.ws.ping)}ms`)
	sent.edit({ content: null, embed: embed })
}

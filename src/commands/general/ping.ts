import { Message, MessageEmbed } from "discord.js"
import { client } from '../../customDefinitions'

export const name = 'ping'
export const description = 'Displays various latency information'
export const usage = 'ping'
export const aliases = ['latency', 'pong']
export const allowInDm = true
export async function execute(client: client, message: Message, args) {
	const sent = await message.channel.send('Pinging...')
	const embed = new MessageEmbed
	embed.setDescription(`:stopwatch: ${sent.createdTimestamp - message.createdTimestamp}ms :hourglass: ${Math.round(client.ws.ping)}ms`)
	embed.setFooter('Roundtrip and api latency')
	embed.setColor('#FB21CB')
	await sent.edit({ content: null, embed: embed })
	message.react('🏓')
}

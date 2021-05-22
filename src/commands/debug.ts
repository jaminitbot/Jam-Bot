import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"

export const name = 'debug'
export const description = 'Displays debug information'
export const permissions = ['ADMINISTRATOR']
export const usage = 'debug'
export async function execute(client: client, message: Message, args, logger: Logger) {
	const sent = await message.channel.send('Loading...')
	let TimeDate = new Date(Date.now() - client.uptime)
	let embed = {
		title: 'Debug Information',
		description: `Roundtrip: \`${sent.createdTimestamp - message.createdTimestamp}ms\`\n
		API: \`${client.ws.ping}ms\`\n
		Revision: \`${process.env.GIT_REV || 'N/A'}\`\n
		Up since: \`${TimeDate.toString()}\`\n
		Guild ID: \`${message.guild.id}\``,
		footer: {
			text: `Intiated by ${message.author.tag}`,
			icon_url: message.author.displayAvatarURL(),
		},
		timestamp: Date.now(),
	}
	sent.edit({ content: '', embed: embed })
}

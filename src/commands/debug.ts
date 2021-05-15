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
		description: `Roundtrip: \`${sent.createdTimestamp - message.createdTimestamp
			}ms\`\nAPI: \`${client.ws.ping}ms\`\nRevision: \`${process.env.GIT_REV || 'N/A'
			}\`\nUp since: \`${TimeDate.toString()}\``,
		footer: {
			text: `Intiated by ${message.author.tag}`,
			icon_url: message.author.displayAvatarURL(),
		},
		timestamp: Date.now(),
	}
	sent.edit({ content: '', embed: embed })
}

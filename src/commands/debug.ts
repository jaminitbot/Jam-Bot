import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"

export const name = 'debug'
export const description = 'Displays debug information'
export const permissions = ['ADMINISTRATOR']
export const usage = 'debug'
export async function execute(client: client, message: Message, args, logger: Logger) {
	const sentMessage = await message.channel.send('Loading...')
	const TimeDate = new Date(Date.now() - client.uptime)
	const embed = {
		title: 'Debug Information',
		description: `Roundtrip: \`${sentMessage.createdTimestamp - message.createdTimestamp}ms\`
		API: \`${client.ws.ping}ms\`
		Revision: \`${process.env.GIT_REV || 'N/A'}\`
		Up since: \`${TimeDate.toString()}\`
		Guild ID: \`${message.guild.id}\``,
		footer: {
			text: `Intiated by ${message.author.tag}`,
			icon_url: message.author.displayAvatarURL(),
		},
		timestamp: Date.now(),
	}
	sentMessage.edit({ content: null, embed: embed })
}

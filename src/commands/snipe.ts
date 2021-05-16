import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
import snipe from '../functions/snipe'
export const name = 'snipe'
export const description = 'Snipes messages'
export const permissions = ''
export const usage = ''
export function execute(client: client, message: Message, args: Array<String>, logger: Logger) {
	// @ts-expect-error
	let snipes: Array = snipe(message.channel)
	let embed = {
		title: '**Deleted messages in the last 20s**',
		description: '',
		footer: {
			text: `Sniped by ${message.author.tag}`,
			icon_url: message.author.displayAvatarURL(),
		},
		timestamp: Date.now(),
	}
	snipes.forEach(element => {
		if (element.channel == message.channel.id) {
			embed.description += `
		Message deleted by ${element.user.username}:
		\`\`\`${element.content}\`\`\``
			if (element.attachments) {
				embed.description += element.attachments.url + '\n'
			}
		}
	})
	message.channel.send({ embed: embed })
}
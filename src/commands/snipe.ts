import { Message, MessageEmbed } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
import snipe from '../functions/snipe'
export const name = 'snipe'
export const description = 'Snipes messages'
export const permissions = ''
export const usage = ''
function generateDeleteEmbed(snipes, message: Message, embed: MessageEmbed) {
	let field = ''
	snipes.forEach(element => {
		if (element.channel == message.channel.id) {
			if (element.type == 'delete') {
				field += `
		Message deleted by <@${element.user.id}>:
		\`\`\`${element.content}\`\`\``
				if (element.attachments) {
					field += element.attachments.url + '\n'
				}
			}
		}
	})
	embed.addField('Message Deletes', field || 'NONE', false)
	return embed
}
function generateEditsEmbed(snipes, message: Message, embed: MessageEmbed) {
	let field = ''
	snipes.forEach(element => {
		if (element.channel == message.channel.id) {
			if (element.type == 'edit') {
				if (element.content) {
					field += `
					Messaged edited by <@${element.user.id}>:
					\`\`\`${element.oldMessage}\`\`\`⬇️
					\`\`\`${element.content}\`\`\``
				}
			}
		}
	})
	embed.addField('Message Edits', field || 'NONE', false)
	return embed
}
export async function execute(client: client, message: Message, args: Array<String>, logger: Logger) {
	// @ts-expect-error
	let snipes: Array = snipe(message.channel)
	let embed = new MessageEmbed()
	let newEmbed
	embed.setFooter(`Sniped by ${message.author.username}`, message.author.avatarURL())
	embed.setTimestamp(Date.now())
	if (!args[0]) { // Both edits and deletes
		embed.setTitle('Message edits and deletes in the last 10s')
		newEmbed = generateEditsEmbed(snipes, message, generateDeleteEmbed(snipes, message, embed))
	} else if ((args[0].toLowerCase() == 'edit') || (args[0].toLowerCase() == 'edits')) {
		embed.setTitle('Message edits in the last 10s')
		newEmbed = generateEditsEmbed(snipes, message, embed)
	} else if ((args[0].toLowerCase() == 'delete') || (args[0].toLowerCase() == 'deletes')) {
		embed.setTitle('Message deletes in the last 10s')
		newEmbed = generateDeleteEmbed(snipes, message, embed)
	}

	let sentMessage = await message.channel.send({ embed: newEmbed })
	try {
		setTimeout(() => sentMessage.edit({ content: 'Sniped messages were here', embed: null }), 10000)
	} catch (err) {
		{ }
	}

}
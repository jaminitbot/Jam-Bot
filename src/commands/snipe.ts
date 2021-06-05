import {Message, MessageEmbed} from "discord.js"
import {client} from '../customDefinitions'
import {Logger} from "winston"
import {returnSnipedMessages, snipeLifetime} from '../functions/snipe'

export const name = 'snipe'
export const description = 'Snipes deleted and edited messages'
export const permissions = ''
export const usage = 'snipe (deletes|edits)'
function generateDeleteEmbed(snipes, message: Message, embed: MessageEmbed) {
	let field = ''
	snipes.forEach(element => {
		if (element.channel == message.channel.id) {
			if (element.type == 'delete') {
				field += `
		Message delet0ed by <@${element.user.id}>:
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
export async function execute(client: client, message: Message, args: Array<string>, logger: Logger) {
	const snipes = returnSnipedMessages()
	const embed = new MessageEmbed()
	let newEmbed
	embed.setFooter(`Sniped by ${message.author.username}`, message.author.avatarURL())
	embed.setTimestamp(Date.now())
	if (!args[0]) { // Both edits and deletes
		embed.setTitle(`Message edits and deletes in the last ${snipeLifetime}s`)
		newEmbed = generateEditsEmbed(snipes, message, generateDeleteEmbed(snipes, message, embed))
	} else if ((args[0].toLowerCase() == 'edit') || (args[0].toLowerCase() == 'edits')) {
		embed.setTitle(`Message edits in the last ${snipeLifetime}s`)
		newEmbed = generateEditsEmbed(snipes, message, embed)
	} else if ((args[0].toLowerCase() == 'delete') || (args[0].toLowerCase() == 'deletes')) {
		embed.setTitle(`Message deletes in the last ${snipeLifetime}s`)
		newEmbed = generateDeleteEmbed(snipes, message, embed)
	} else {
		message.reply('that isn\'t a valid option')
		return
	}
	newEmbed.setColor('#BCD8C1')
	message.channel.send({ embed: newEmbed })
}
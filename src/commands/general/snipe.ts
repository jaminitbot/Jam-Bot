import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { MessageSniped, returnSnipedMessages, snipeLifetime } from '../../functions/snipe'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'snipe'
export const description = 'Snipes deleted and edited messages'
export const permissions = ''
export const usage = 'snipe (deletes|edits)'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('type')
			.setDescription('(Optional): The type of message (edits or deletes) to snipe')
			.setRequired(false))
function returnSnipesEmbed(snipes: Array<MessageSniped>, type: string, channelId) {
	const embed = new MessageEmbed
	if (type) {
		const ed = type.endsWith('e') ? type.substr(0, type.length - 1) : type
		embed.setTitle(`Messages ${ed}ed in the last ${snipeLifetime} seconds`)
	} else {
		embed.setTitle(`Messages edited/deleted in the last ${snipeLifetime} seconds`)
	}
	for (const snipe of snipes) {
		if (!type || snipe.type == type) {
			if (embed.fields.length == 24) {
				embed.addField('Too many messages have been edited/deleted', 'Only showing the latest 25 edit/deletes')
				break
			}
			if (snipe.type == 'delete') {
				embed.addField(`Message deleted by ${snipe.user.tag}`, snipe.newMessage)
			} else if (snipe.type == 'edit') {
				embed.addField(`Message edited by ${snipe.user.tag}`, `**Before:** ${snipe.oldMessage}\n**+After:** ${snipe.newMessage}`)
			}
		}
	}
	embed.setTimestamp(Date.now())
	embed.setColor('#BCD8C1')
	return embed
}

export async function execute(client: BotClient, message: Message, args) {
	const snipes = returnSnipedMessages()
	let type = args[0] ?? null
	if (type) type = type.substring(0, type.length - 1)
	if (type) {
		if (type != 'delete' && type != 'edit') return message.reply('Type has to be either `deletes` or `edits`')
	} else {
		type = null
	}

	const embed = returnSnipesEmbed(snipes, type, message.channel.id)
	embed.setFooter(`Sniped by ${message.author.username}`, message.author.avatarURL())
	try {
		await message.channel.send({ embeds: [embed] })
	} catch (err) {
		return
	}

}

export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const snipes = returnSnipedMessages()
	let type = interaction.options.getString('type') ?? null
	if (type) type = type.substring(0, type.length - 1)
	if (type && type != 'edit' && type != 'delete') return interaction.reply({ content: 'Type has to be either `deletes` or `edits`', ephemeral: true })
	const embed = returnSnipesEmbed(snipes, type, interaction.channel.id)
	try {
		await interaction.reply({ embeds: [embed] })
	} catch (err) {
		return
	}

}
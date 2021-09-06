import { CommandInteraction, GuildMember, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { MessageSniped, returnSnipedMessages, snipeLifetime } from '../../functions/snipe'
import { SlashCommandBuilder } from '@discordjs/builders'
import { isBotOwner } from '../../functions/util'
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

function returnSnipesEmbed(snipes: Array<MessageSniped>, type: string, channelId: string, member: GuildMember) {
	const embed = new MessageEmbed
	const canSnipeOwner = member.permissions.has('ADMINISTRATOR')
	if (type) {
		const ed = type.endsWith('e') ? type.substr(0, type.length - 1) : type
		embed.setTitle(`Messages ${ed}ed in the last ${snipeLifetime} seconds`)
	} else {
		embed.setTitle(`Messages edited/deleted in the last ${snipeLifetime} seconds`)
	}
	for (const snipe of snipes) {
		if (snipe.channel != channelId) continue // Not a snipe for that channel
		if (isBotOwner(snipe.user.id) && !canSnipeOwner) continue // Isn't admin and snipe was by a bot owner
		if (!type || snipe.type == type) {
			if (embed.fields.length == 23) { // Discord api limitation
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
	if (embed.fields.length == 0) {
		embed.setDescription(`No edits/deletes in the last ${snipeLifetime} seconds`)
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
	const embed = returnSnipesEmbed(snipes, type, message.channel.id, message.member)
	embed.setFooter(`Sniped by ${message.author.username}`, message.author.avatarURL()) // Add sniped by since author is not shown when using legacy prefix commands
	try {
		await message.channel.send({ embeds: [embed] })
	} catch {
		return
	}
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const snipes = returnSnipedMessages()
	let type = interaction.options.getString('type') ?? null
	if (type) type = type.substring(0, type.length - 1)
	if (type && type != 'edit' && type != 'delete') return interaction.reply({ content: 'Type has to be either `deletes` or `edits`', ephemeral: true })
	// @ts-expect-error
	const embed = returnSnipesEmbed(snipes, type, interaction.channel.id, interaction.member)
	try {
		await interaction.reply({ embeds: [embed] })
	} catch {
		return
	}
}
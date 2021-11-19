import { CommandInteraction, Message, MessageEmbed } from 'discord.js'
import { BotClient } from '../../customDefinitions'
import {
	MessageSniped,
	returnSnipedMessages,
	snipeLifetime,
} from '../../functions/snipe'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'

export const name = 'snipe'
export const description = 'Shows recent edited/deleted messages'
export const usage = 'snipe (deletes|edits)'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption((option) =>
		option
			.setName('type')
			.setDescription('The type of message (edits or deletes) to snipe')
			.setRequired(false)
	)

function returnSnipesEmbed(
	snipes: Array<MessageSniped>,
	type: string,
	channelId: string
) {
	const embed = new MessageEmbed()
	let ed
	if (type) {
		ed = type.endsWith('e') ? type.substr(0, type.length - 1) : type
		embed.setTitle(
			i18next.t('snipe.SNIPE_TITLE', {
				context: 'SPECIFIC',
				snipeType: ed + 'ed',
				snipeLifetime: snipeLifetime,
			})
		)
	} else {
		embed.setTitle(
			i18next.t('snipe.SNIPE_TITLE', { snipeLifetime: snipeLifetime })
		)
	}
	for (const snipe of snipes) {
		if (snipe.isOwner) continue // Don't snipe owners
		if (!type || snipe.type == type) {
			if (embed.fields.length == 24) {
				// Discord api limitation
				embed.addField(
					i18next.t('snipe.EMBED_LIMIT_REACHED_BREIF'),
					i18next.t('snipe.EMBED_LIMIT_REACHED_DESCRIPTION')
				)
				break
			}
			if (snipe.type == 'delete') {
				embed.addField(
					i18next.t('snipe.ENTRY_TITLE', {
						snipeType: 'deleted',
						tag: snipe.user.tag,
					}),
					snipe.newMessage
				)
			} else if (snipe.type == 'edit') {
				embed.addField(
					i18next.t('snipe.ENTRY_TITLE', {
						snipeType: 'edited',
						tag: snipe.user.tag,
					}),
					i18next.t('events:messageLogs.EDIT_ENTRY', {
						before:
							snipe.oldMessage ??
							i18next.t('events:messageLogs.NO_CONTENT'),
						after:
							snipe.newMessage ??
							i18next.t('events:messageLogs.NO_CONTENT'),
					})
				)
			}
		}
	}
	if (embed.fields.length == 0) {
		embed.setDescription(
			i18next.t('snipe.NO_MESSAGES', {
				snipeType: ed ? ed + 'ed' : 'edited/deleted',
				snipeLifetime: snipeLifetime,
			})
		)
	}
	embed.setTimestamp(Date.now())
	embed.setColor('#BCD8C1')
	return embed
}

export async function execute(
	client: BotClient,
	message: Message,
	args: Array<unknown>
) {
	const snipes = returnSnipedMessages(message.channel.id)
	let type = args[0] ? String(args[0]) : null
	if (type) {
		type = type.substring(0, type.length - 1)
	}
	if (type) {
		if (type != 'delete' && type != 'edit')
			return message.reply(i18next.t('snipe.INVALID_SNIPE_TYPE'))
	}
	const embed = returnSnipesEmbed(snipes, type, message.channel.id)
	embed.setFooter(
		`Sniped by ${message.author.username}`,
		message.author.avatarURL()
	) // Add sniped by since author is not shown when using legacy prefix commands
	await message.channel.send({ embeds: [embed] })
}

export async function executeSlash(
	client: BotClient,
	interaction: CommandInteraction
) {
	const snipes = returnSnipedMessages(interaction.channel.id)
	let type = interaction.options.getString('type') ?? null
	if (type) type = type.substring(0, type.length - 1)
	if (type && type != 'edit' && type != 'delete')
		return interaction.reply({
			content: i18next.t('snipe.INVALID_SNIPE_TYPE'),
			ephemeral: true,
		})
	const embed = returnSnipesEmbed(snipes, type, interaction.channel.id)
	await interaction.reply({ embeds: [embed] })
}

/* eslint-disable @typescript-eslint/no-empty-function */
// @ts-nocheck
import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { mute, moddable, parseDuration } from "../../functions/mod"
import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import i18next from "i18next"
dayjs.extend(duration)
dayjs.extend(relativeTime)

export const name = 'mute'
export const description = 'Mutes a user'
export const permissions = ['MANAGE_MESSAGES']
export const usage = 'mute @user 1h reason'
export const allowInDm = false
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user to mute')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('duration')
			.setDescription('Duration to mute the user for')
			.setRequired(false))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('Reason for muting the user')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	message.channel.send(i18next.t('general:ONLY_SLASH_COMMAND', { command: '/mute' }))
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({ content: 'I don\'t have permission to manage roles! Ask an admin to check my permissions!', ephemeral: true })
	const targetUser = interaction.options.getUser('user')
	const isModdable = await moddable(interaction.guild, targetUser.id, interaction.user.id)
	switch (isModdable) {
		case 1:
			return interaction.reply({ content: i18next.t('mod.INVALID_USER'), ephemeral: true })
		case 2:
			return interaction.reply({ content: i18next.t('mod.SAME_USER', { action: 'mute' }), ephemeral: true })
		case 3:
			return interaction.reply({ content: i18next.t('mod.BOT_ROLE_TOO_LOW'), ephemeral: true })
		case 4:
			return interaction.reply({ content: i18next.t('USER_ROLE_TOO_LOW'), ephemeral: true })
	}
	const reason = interaction.options.getString('reason')
	const formattedReason = `${interaction.user.tag}: ${reason ?? i18next.t('mod.NO_REASON_SPECIFIED')}`
	const duration = interaction.options.getString('duration')
	const parsedDuration = parseDuration(duration)
	const muteResult = await mute(interaction.guild, targetUser.id, interaction.user.id, formattedReason, parsedDuration)
	if (muteResult == 0) {
		if (duration) {
			interaction.reply({ content: i18next.t('mod.ACTION_SUCCESSFUL_WITH_DURATION', { tag: targetUser.tag, action: 'muted', duration: parsedDuration, reason: reason ?? i18next.t('mod.NO_REASON_SPECIFIED') }), allowedMentions: { parse: [] } })
		} else {
			interaction.reply({ content: i18next.t('mod.ACTION_SUCCESSFUL', { tag: targetUser.tag, action: 'muted', reason: reason ?? i18next.t('mod.NO_REASON_SPECIFIED') }), allowedMentions: { parse: [] } })
		}
	} else if (muteResult == 3) {
		interaction.reply({ content: i18next.t('mute.NO_MUTED_ROLE'), ephemeral: true })
	} else {
		interaction.reply(i18next.t('general:UNKNOWN_ERROR'))
	}
}
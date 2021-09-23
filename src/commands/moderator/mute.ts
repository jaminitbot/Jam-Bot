/* eslint-disable @typescript-eslint/no-empty-function */
// @ts-nocheck
import { ButtonInteraction, CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { mute, moddable, parseDuration } from "../../functions/mod"
import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
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
			.setDescription('Reason to mute the user for')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args, transaction) {
	message.channel.send('Please use the slash command to mute people!')
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({ content: 'I don\'t have permission to manage roles! Ask an admin to check my permissions!', ephemeral: true })
	const targetUser = interaction.options.getUser('user')
	const isModdable = await moddable(interaction.guild, targetUser.id, interaction.user.id)
	switch (isModdable) {
		case 1:
			return interaction.reply({ content: 'The user you provided was invalid.', ephemeral: true })
		case 2:
			return interaction.reply({ content: 'You can\'t mute yourself silly!', ephemeral: true })
		case 3:
			return interaction.reply({ content: 'My roles don\'t allow me to do that, ask an admin to make sure my role is higher than the target users!', ephemeral: true })
		case 4:
			return interaction.reply({ content: 'Your highest role is lower than the targets! You can\'t mute them!', ephemeral: true })
	}
	const reason = interaction.options.getString('reason')
	const formattedReason = `${interaction.user.tag}: ${reason ?? 'No reason specified.'}`
	const duration = interaction.options.getString('duration')
	const parsedDuration = parseDuration(duration)
	const muteResult = await mute(interaction.guild, targetUser.id, interaction.user.id, formattedReason, parsedDuration)
	if (muteResult == 0) {
		if (duration) {
			const humanDuration = dayjs.duration(parsedDuration, "ms").humanize()
			interaction.reply(`${targetUser.tag} has been muted for ${humanDuration} with reason: ${reason ?? 'None'}.`)
		} else {
			interaction.reply(`${targetUser.tag} has been muted with reason: ${reason ?? 'None'}.`)
		}
	} else if (muteResult == 3) {
		interaction.reply({ content: 'There isn\'t a role named `Muted`! Ask an admin to make it!', ephemeral: true })
	} else {
		interaction.reply('There was an unknown error muting the user')
	}
}
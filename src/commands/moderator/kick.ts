import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { kick, moddable } from "../../functions/mod"
import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import i18next from "i18next"
dayjs.extend(duration)
dayjs.extend(relativeTime)

export const name = 'kick'
export const description = 'Kicks a user from the server'
export const permissions = ['KICK_MEMBERS']
export const usage = 'kick @user'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user to kick')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason for kicking the user')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	message.channel.send('Please use the slash command to kick people!')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	if (!interaction.guild.me.permissions.has('KICK_MEMBERS')) return interaction.reply({ content: 'I don\'t have the correct permissions to kick people, ask an admin to check my permissions!' })
	const targetUser = interaction.options.getUser('user')
	const isModdable = await moddable(interaction.guild, targetUser.id, interaction.user.id)
	switch (isModdable) {
		case 1:
			return interaction.reply({ content: i18next.t('mod.INVALID_USER'), ephemeral: true })
		case 2:
			return interaction.reply({ content: i18next.t('mod.SAME_USER', { action: 'kick' }), ephemeral: true })
		case 3:
			return interaction.reply({ content: i18next.t('mod.BOT_ROLE_TOO_LOW'), ephemeral: true })
		case 4:
			return interaction.reply({ content: i18next.t('USER_ROLE_TOO_LOW'), ephemeral: true })
	}
	const reason = interaction.options.getString('reason')
	const formattedReason = `${interaction.user.tag}: ${reason ?? i18next.t('mod.NO_REASON_SPECIFIED')}`
	const kickResult = await kick(interaction.guild, targetUser.id, interaction.user.id, formattedReason)
	if (kickResult == 0) {
		interaction.reply(i18next.t('mod.ACTION_SUCCESSFUL', { tag: targetUser.tag, action: 'kicked', reason: reason ?? i18next.t('mod.NO_REASON_SPECIFIED') }))
	} else {
		interaction.reply(i18next.t('general:UNKNOWN_ERROR'))
	}
}
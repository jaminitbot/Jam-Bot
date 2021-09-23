import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { moddable, ban, parseDuration } from '../../functions/mod'
import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(duration)
dayjs.extend(relativeTime)

export const name = 'ban'
export const description = 'Bans a user from the server'
export const permissions = ['BAN_MEMBERS']
export const usage = 'ban @user'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user to ban')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('duration')
			.setDescription('Duration to ban the user for')
			.setRequired(false))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('Reason to ban the user for')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	message.channel.send('Please use the slash command to ban people!')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({ content: 'I don\'t have the correct permissions to ban people, ask an admin to check my permissions!' })
	const targetUser = interaction.options.getUser('user')
	const isModdable = await moddable(interaction.guild, targetUser.id, interaction.user.id)
	switch (isModdable) {
		case 1:
			return interaction.reply({ content: 'The user you provided was invalid.', ephemeral: true })
		case 2:
			return interaction.reply({ content: 'You can\'t ban yourself silly!', ephemeral: true })
		case 3:
			return interaction.reply({ content: 'My roles don\'t allow me to do that, ask an admin to make sure my role is higher than the target users!', ephemeral: true })
		case 4:
			return interaction.reply({ content: 'Your highest role is lower than the targets! You can\'t ban them!', ephemeral: true })
	}
	const reason = interaction.options.getString('reason')
	const formattedReason = `${interaction.user.tag}: ${reason ?? 'No reason specified.'}`
	const duration = interaction.options.getString('duration')
	const parsedDuration = parseDuration(duration)
	const banResult = await ban(interaction.guild, targetUser.id, interaction.user.id, formattedReason, parsedDuration)
	if (banResult == 0) {
		if (duration) {
			const humanDuration = dayjs.duration(parsedDuration, "ms").humanize()
			interaction.reply(`${targetUser.tag} has been banned for ${humanDuration} with reason: ${reason ?? 'None'}.`)
		} else {
			interaction.reply(`${targetUser.tag} has been banned with reason: with reason: ${reason ?? 'None'}.`)
		}
	} else {
		interaction.reply('There was an unknown error banning the user')
	}
}


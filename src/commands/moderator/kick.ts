import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { kick, moddable } from "../../functions/mod"
import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
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
			.setDescription('(Optional) reason to kick the user for')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args) {
	message.channel.send('Please use the slash command to kick people!')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	if (!interaction.guild.me.permissions.has('KICK_MEMBERS')) return interaction.reply({ content: 'I don\'t have the correct permissions to kick people, ask an admin to check my permissions!' })
	const targetUser = interaction.options.getUser('user')
	const isModdable = await moddable(interaction.guild, targetUser.id, interaction.user.id)
	switch (isModdable) {
		case 1:
			return interaction.reply({ content: 'The user you provided was invalid.', ephemeral: true })
		case 2:
			return interaction.reply({ content: 'You can\'t kick yourself silly!', ephemeral: true })
		case 3:
			return interaction.reply({ content: 'My roles don\'t allow me to do that, ask an admin to make sure my role is higher than the target users!', ephemeral: true })
		case 4:
			return interaction.reply({ content: 'Your highest role is lower than the targets! You can\'t kick them!', ephemeral: true })
	}
	const reason = interaction.options.getString('reason')
	const formattedReason = `${interaction.user.tag}: ${reason ?? 'No reason specified.'}`
	const kickResult = await kick(interaction.guild, targetUser.id, interaction.user.id, formattedReason)
	if (kickResult == 0) {
		interaction.reply(`${targetUser.tag} has been kicked with reason: ${reason ?? 'None'}.`)
	} else {
		interaction.reply('There was an unknown error kicking the user')
	}
}
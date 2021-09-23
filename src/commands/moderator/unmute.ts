import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { moddable, unmute } from '../../functions/mod'

export const name = 'unmute'
export const description = 'Unmutes a user'
export const permissions = ['MANAGE_MESSAGES']
export const usage = 'unmute @user'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user to unmute')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('Reason to unmute the user for')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	message.channel.send('Please use the slash command to unmute people!')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({ content: 'I don\'t have the correct permissions to unmute people, ask an admin to check my permissions!' })
	const targetUser = interaction.options.getUser('user')
	const isModdable = await moddable(interaction.guild, targetUser.id, interaction.user.id)
	switch (isModdable) {
		case 1:
			return interaction.reply({ content: 'The user you provided was invalid.', ephemeral: true })
		case 2:
			return interaction.reply({ content: 'You can\'t unmute yourself silly!', ephemeral: true })
		case 3:
			return interaction.reply({ content: 'My roles don\'t allow me to do that, ask an admin to make sure my role is higher than the target users!', ephemeral: true })
		case 4:
			return interaction.reply({ content: 'Your highest role is lower than the targets! You can\'t unmute them!', ephemeral: true })
	}
	const reason = interaction.options.getString('reason')
	const formattedReason = `${interaction.user.tag}: ${reason ?? 'No reason specified.'}`
	const unmuteResult = await unmute(interaction.guild, targetUser.id, interaction.user.id, formattedReason)
	if (unmuteResult == 0) {
		interaction.reply(`${targetUser.tag} has been unmuted!`)
	} else {
		interaction.reply('There was an unknown error unmuting the user')
	}
}

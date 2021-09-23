import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { moddable, unban } from '../../functions/mod'

export const name = 'unban'
export const description = 'Unbans a user from the server'
export const permissions = ['BAN_MEMBERS']
export const usage = 'unban @user'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user to unban')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('Reason to unban the user for')
			.setRequired(false))
export async function execute(client: BotClient, message: Message, args, transaction) {
	message.channel.send('Please use the slash command to unban people!')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({ content: 'I don\'t have the correct permissions to unban people, ask an admin to check my permissions!' })
	const targetUser = interaction.options.getUser('user')
	const isModdable = await moddable(interaction.guild, targetUser.id, interaction.user.id)
	switch (isModdable) {
		case 1:
			break
		case 2:
			return interaction.reply({ content: 'You can\'t unban yourself silly!', ephemeral: true })
		case 3:
			break
		case 4:
			break
	}
	try {
		await interaction.guild.bans.fetch(targetUser.id)
	} catch (err) {
		if (String(err).includes('Unknown Ban')) {
			interaction.reply({ content: `${targetUser.tag} is not banned!`, ephemeral: true })
			return
		} else {
			interaction.reply('There was an unknown error unbanning the user')
			client.logger.warn('Unknown error when fetching bans: ' + err)
			return
		}
	}
	const reason = interaction.options.getString('reason')
	const formattedReason = `${interaction.user.tag}: ${reason ?? 'No reason specified.'}`
	const banResult = await unban(interaction.guild, targetUser.id, interaction.user.id, formattedReason)
	if (banResult == 0) {
		interaction.reply(`${targetUser.tag} has been unbanned!`)
	} else {
		interaction.reply('There was an unknown error unbanning the user')
	}
}

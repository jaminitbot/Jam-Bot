import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { getKey } from '../../functions/db'
import { SlashCommandBuilder } from '@discordjs/builders'
import { isBotOwner } from '../../functions/util'
import i18next from "i18next"

export const name = 'help'
export const description = 'Displays information on a specific command'
export const usage = 'help command'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('command')
			.setDescription('The command you\'d like to get help on')
			.setRequired(false))
async function returnHelpEmbed(client: BotClient, commandToGet: string, prefix: string, userId: string) {
	const embed = new MessageEmbed
	embed.setColor('#439A86')
	if (commandToGet) {
		commandToGet = String(commandToGet).toLowerCase()
		const command = client.commands.get(commandToGet) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandToGet))
		if (command && !(command.permissions && command.permissions.includes('OWNER') && !isBotOwner(userId))) {
			embed.setTitle(i18next.t('help.HELP_TITLE', { commandName: command.name ?? commandToGet }))
			const description = command.description ?? i18next.t('help.NO_DESCRIPTION')
			const usage = command.usage ? prefix + command.usage : prefix + commandToGet
			embed.addField(i18next.t('help.DESCRIPTION'), description, true)
			embed.addField(i18next.t('help.USAGE'), usage, true)
			if (command.aliases && prefix != '/') embed.addField(i18next.t('help.ALIASES'), command.aliases.toString(), true)
			if (command.permissions) {
				const permissionsNeeded = command.permissions.toString()
				embed.addField(i18next.t('help.PERMISSIONS_REQUIRED'), permissionsNeeded, true)
			}
		} else {
			embed.setDescription(i18next.t('help.COMMAND_UNKNOWN'))
		}
	} else {
		// Generic help command
		embed.setDescription(i18next.t('help.VIEW_COMMAND_DOCS', { url: 'https://jambot.jaminit.co.uk/#/commands/basic' }))
	}
	return embed
}
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	const commandToFind = String(args[0])
	const guildId = message.guild ? message.guild.id : 0
	const prefix = await getKey(guildId, 'prefix') || process.env.defaultPrefix
	const embed = await returnHelpEmbed(client, commandToFind, prefix, message.author.id)
	await message.channel.send({ embeds: [embed] })
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const commandToGet = interaction.options.getString('command')
	const embed = await returnHelpEmbed(client, commandToGet, '/', interaction.user.id)
	await interaction.reply({ embeds: [embed] })
}

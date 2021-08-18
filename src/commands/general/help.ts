import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { getKey } from '../../functions/db'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'help'
export const description = 'Displays information on a specific command'
export const usage = 'help command'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('command')
			.setDescription('(Optional) the command you\'d like to get help on')
			.setRequired(false))
async function returnHelpEmbed(client: BotClient, commandToGet, prefix) {
	const embed = new MessageEmbed
	embed.setColor('#439A86')
	if (commandToGet) {
		commandToGet = String(commandToGet).toLowerCase()
		const command = client.commands.get(commandToGet) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandToGet));
		embed.setTitle('Help: ' + prefix + command.name ?? commandToGet)
		if (command) {
			const description = command.description ?? 'None'
			const usage = command.usage ? prefix + command.usage : prefix + commandToGet
			embed.addField('Description', description, true)
			embed.addField('Usage', usage, true)
			if (command.aliases && prefix != '/') embed.addField('Aliases', command.aliases.toString(), true)
			if (command.permissions) {
				const permissionsNeeded = command.permissions.toString()
				embed.addField('Permissions Needed', permissionsNeeded, true)
			}
		} else {
			embed.setDescription('Specified command doesn\'t exist :(')
		}
	} else {
		// Generic help command
		embed.setDescription('You can view a list of commands [here](https://jambot.jaminit.co.uk/#/commands/basic)')
	}
	return embed
}
export async function execute(client: BotClient, message: Message, args) {
	const commandToFind = args[0]
	const guildId = message.guild ? message.guild.id : 0
	const prefix = await getKey(guildId, 'prefix') || process.env.defaultPrefix
	const embed = await returnHelpEmbed(client, commandToFind, prefix)
	message.channel.send({ embeds: [embed] })
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const commandToGet = interaction.options.getString('command')
	const embed = await returnHelpEmbed(client, commandToGet, '/')
	interaction.reply({ embeds: [embed] })
}

import { BotClient } from "../customDefinitions";
import { Interaction } from "discord.js";
import { getKey } from "../functions/db";
import { checkPermissions } from "../functions/util";
import { getErrorMessage, getInvalidPermissionsMessage } from '../functions/messages'
export const name = "interactionCreate"

export async function register(client: BotClient, interaction: Interaction) {
	if (interaction.isCommand()) { // Is a slash command
		const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName))
		if (!command) return
		if (typeof command.executeSlash != 'function') {
			const guildId = interaction.guild ? interaction.guild.id : 0
			const prefix = await getKey(guildId, 'prefix') || process.env.defaultPrefix
			return interaction.reply({ content: `This command hasn't been setup for slash commands yet, please use \`${prefix}${command.name}\` for the time being!`, ephemeral: true })
		}
		if (interaction.channel.type == 'DM' && !command.allowInDm) return interaction.reply('Sorry, that command can only be run in a server!')
		if (command.permissions) {
			// @ts-expect-error
			if (!checkPermissions(interaction.member, [...command.permissions])) {
				// User doesn't have specified permissions to run command
				client.logger.debug(`messageHandler: User ${interaction.user.tag} doesn't have the required permissions to run command ${interaction.commandName ?? 'NULL'}`)
				return interaction.reply({ content: getInvalidPermissionsMessage() })
			}
		}
		try {
			await command.executeSlash(client, interaction)
		} catch (error) {
			// Error running command
			client.logger.error('interactionHandler: Command failed with error: ' + error)
			interaction.reply({ content: getErrorMessage() })
		}
	} else if (interaction.isButton()) {
		const buttonNameObject = interaction.customId.trim().split('-')
		const command = client.commands.get(buttonNameObject[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(buttonNameObject[0]))
		if (command) {
			try {
				command.executeButton(client, interaction)
			} catch (error) {
				// Error running command
				client.logger.error('interactionHandler: Command button failed with error: ' + error)
			}
		}
	}
}
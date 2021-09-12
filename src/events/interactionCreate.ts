import { BotClient } from "../customDefinitions";
import { Interaction } from "discord.js";
import { getKey } from "../functions/db";
import { checkPermissions } from "../functions/util";
import { getErrorMessage, getInvalidPermissionsMessage } from '../functions/messages'
import { storeSlashCommandCreate } from '../cron/stats'
export const name = "interactionCreate"

export async function register(client: BotClient, interaction: Interaction) {
	if (interaction.isCommand()) { // Is a slash command
		const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName))
		if (!command) return
		storeSlashCommandCreate(interaction)
		if (typeof command.executeSlash != 'function') {
			const guildId = interaction.guild ? interaction.guild.id : 0
			const prefix = await getKey(guildId, 'prefix') || process.env.defaultPrefix
			return interaction.reply({ content: `This command hasn't been setup for slash commands yet, please use \`${prefix}${command.name}\` for the time being!`, ephemeral: true })
		}
		if (!interaction.channel) return interaction.reply('Sorry, slash commands don\'t work in dms yet')
		if (command.permissions) {
			// @ts-expect-error
			if (!checkPermissions(interaction.member, [...command.permissions])) {
				// User doesn't have specified permissions to run command
				client.logger.debug(`messageHandler: User ${interaction.user.tag} doesn't have the required permissions to run command ${interaction.commandName ?? 'NULL'}`)
				return interaction.reply({ content: getInvalidPermissionsMessage(), ephemeral: true })
			}
		}
		try {
			await command.executeSlash(client, interaction)
		} catch (error) {
			// Error running command
			client.logger.error('interactionHandler: Command failed with error: ' + error)
			try {
				if (interaction.deferred) {
					interaction.editReply({ content: getErrorMessage() })
				} else {
					interaction.reply({ content: getErrorMessage() })
				}
				// eslint-disable-next-line no-empty
			} catch {

			}


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
	} else if (interaction.isSelectMenu()) {
		const selectNameObject = interaction.customId.trim().split('-')
		const command = client.commands.get(selectNameObject[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(selectNameObject[0]))
		if (command) {
			try {
				command.executeSelectMenu(client, interaction)
			} catch (error) {
				// Error running command
				client.logger.error('interactionHandler: Command button failed with error: ' + error)
			}
		}
	}
}
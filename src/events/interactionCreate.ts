import { BotClient } from "../customDefinitions";
import { Interaction } from "discord.js";
import { getKey } from "../functions/db";
import { capitaliseSentence, checkPermissions } from "../functions/util";
import { getErrorMessage, getInvalidPermissionsMessage } from '../functions/messages'
import { storeSlashCommandCreate } from '../cron/stats'
import * as Sentry from "@sentry/node"

export const name = "interactionCreate"

export async function register(client: BotClient, interaction: Interaction) {
	const guildId = interaction.guild ? interaction.guild.id : 0
	if (interaction.isCommand()) { // Is a slash command
		const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName))
		if (!command) {
			return
		}
		storeSlashCommandCreate(interaction)
		if (typeof command.executeSlash != 'function') {
			const prefix = await getKey(guildId, 'prefix') || process.env.defaultPrefix
			await interaction.reply({ content: `This command hasn't been setup for slash commands yet, please use \`${prefix}${command.name}\` for the time being!`, ephemeral: true })
			return
		}
		if (!interaction.channel) return interaction.reply('Sorry, slash commands don\'t work in dms yet')
		if (command.permissions) {
			// @ts-expect-error
			if (!checkPermissions(interaction.member, [...command.permissions])) {
				// User doesn't have specified permissions to run command
				client.logger.debug(`messageHandler: User ${interaction.user.tag} doesn't have the required permissions to run command ${interaction.commandName ?? 'NULL'}`)
				await interaction.reply({ content: getInvalidPermissionsMessage(), ephemeral: true })
				return
			}
		}
		const transaction = Sentry.startTransaction({
			op: command.name + 'Command',
			name: capitaliseSentence(command.name) + ' Command',
		})
		Sentry.configureScope(async scope => {
			scope.setSpan(transaction)
			scope.setUser({ id: interaction.user.id, username: interaction.user.tag })
			scope.setContext('Guild', {
				name: guildId != 0 ? (await client.guilds.fetch(guildId)).name ?? 'N/A' : 'N/A',
				id: guildId
			})
			scope.setContext('Interaction', {
				name: interaction.commandName,
				id: interaction.id
			})
			scope.setTags({ type: 'slash' })
		})
		try {
			await command.executeSlash(client, interaction, transaction)
		} catch (error) {
			Sentry.captureException(error)
			// Error running command
			client.logger.error('interactionHandler: Command failed with error: ' + error)
			try {
				if (interaction.deferred) {
					interaction.editReply({ content: getErrorMessage() })
				} else {
					interaction.reply({ content: getErrorMessage() })
				}
				// eslint-disable-next-line no-empty
			} catch (err) {
				Sentry.captureException(err)
			}
		} finally {
			transaction.finish()
		}
	} else if (interaction.isButton()) {
		const buttonNameObject = interaction.customId.trim().split('-')
		const command = client.commands.get(buttonNameObject[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(buttonNameObject[0]))
		if (!command) return
		const transaction = Sentry.startTransaction({
			op: command.name + 'Command',
			name: capitaliseSentence(command.name) + ' Command',
		})
		Sentry.configureScope(async scope => {
			scope.setSpan(transaction)
			scope.setUser({ id: interaction.user.id, username: interaction.user.tag })
			scope.setContext('Guild', {
				name: guildId != 0 ? (await client.guilds.fetch(guildId)).name ?? 'N/A' : 'N/A',
				id: guildId
			})
			scope.setContext('Interaction', {
				name: interaction.customId,
				id: interaction.id
			})
			scope.setTags({ type: 'button' })
		})
		try {
			command.executeButton(client, interaction, transaction)
		} catch (error) {
			Sentry.captureException(error)
			// Error running command
			client.logger.error('interactionHandler: Command button failed with error: ' + error)
		} finally {
			transaction.finish()
		}
	} else if (interaction.isSelectMenu()) {
		const selectNameObject = interaction.customId.trim().split('-')
		const command = client.commands.get(selectNameObject[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(selectNameObject[0]))
		if (!command) return
		const transaction = Sentry.startTransaction({
			op: command.name + 'Command',
			name: capitaliseSentence(command.name) + ' Command',
		})
		Sentry.configureScope(async scope => {
			scope.setSpan(transaction)
			scope.setUser({ id: interaction.user.id, username: interaction.user.tag })
			scope.setContext('Guild', {
				name: guildId != 0 ? (await client.guilds.fetch(guildId)).name ?? 'N/A' : 'N/A',
				id: guildId
			})
			scope.setContext('Interaction', {
				name: interaction.customId,
				id: interaction.id
			})
			scope.setTags({ type: 'selectMenu' })
		})
		try {
			command.executeSelectMenu(client, interaction, transaction)
		} catch (error) {
			// Error running command
			client.logger.error('interactionHandler: Command button failed with error: ' + error)
		} finally {
			transaction.finish()
		}
	}
}
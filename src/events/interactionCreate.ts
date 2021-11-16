import { BotClient } from '../customDefinitions'
import { Interaction } from 'discord.js'
import { getKey } from '../functions/db'
import { capitaliseSentence, checkPermissions } from '../functions/util'
import {
    getErrorMessage,
    getInvalidPermissionsMessage,
} from '../functions/messages'
import Sentry from '../functions/sentry'
import i18next from 'i18next'
import { incrementInteractionCounter } from '../functions/metrics'

export const name = 'interactionCreate'
export async function register(client: BotClient, interaction: Interaction) {
    const guildId = interaction.guild ? interaction.guild.id : 0
    let commandName
    if (
        interaction.isCommand() ||
        interaction.isContextMenu() ||
        interaction.isAutocomplete()
    ) {
        commandName = interaction.commandName
    } else if (interaction.isButton() || interaction.isSelectMenu()) {
        const nameObject = interaction.customId.trim().split('-')
        commandName = nameObject[0]
    } else {
        return
    }
    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        )
    if (!command) {
        return
    }
    if (
        (!interaction.channel || interaction.channel?.type == 'DM') &&
        command.allowInDm !== true
    ) {
        if (
            interaction.isCommand() ||
            interaction.isButton() ||
            interaction.isContextMenu() ||
            interaction.isSelectMenu()
        ) {
            interaction.reply(
                i18next.t('events:interactionCreate.DISABLED_IN_DMS')
            )
        }
        return
    }
    if (
        interaction.channel?.type == 'GUILD_PUBLIC_THREAD' ||
        interaction.channel?.type == 'GUILD_PRIVATE_THREAD'
    ) {
        try {
            await interaction.channel.join()
            // eslint-disable-next-line no-empty
        } catch { }
    }
    if (command.permissions) {
        // @ts-expect-error
        if (!checkPermissions(interaction.member, [...command.permissions])) {
            // User doesn't have specified permissions to run command
            client.logger.debug(
                `messageHandler: User ${interaction.user.tag
                } doesn't have the required permissions to run command ${
                // @ts-expect-error
                interaction.commandName ?? 'NULL'
                }`
            )
            if (
                interaction.isCommand() ||
                interaction.isButton() ||
                interaction.isContextMenu() ||
                interaction.isSelectMenu()
            ) {
                await interaction.reply({
                    content: getInvalidPermissionsMessage(),
                    ephemeral: true,
                })
            }
            return
        }
    }
    if (interaction.isCommand()) {
        // Is a slash command
        if (typeof command.executeSlash != 'function') {
            const prefix =
                (await getKey(guildId, 'prefix')) || process.env.defaultPrefix
            interaction.reply({
                content: i18next.t(
                    'events:interactionCreate.SLASH_FUNCTION_NULL',
                    { prefix: prefix, command: command.name }
                ),
                ephemeral: true,
            })
            return
        }
        Sentry.withInteractionScope(interaction, async () => {
            const transaction = Sentry.startTransaction({
                op: command.name + 'Command',
                name: capitaliseSentence(command.name) + ' Command',
            })
            try {
                await command.executeSlash(client, interaction)
            } catch (error) {
                Sentry.captureException(error)
                // Error running command
                client.logger.error(
                    'interactionHandler: Command failed with error: ' + error
                )
                try {
                    if (interaction.deferred) {
                        try {
                            interaction.editReply({
                                content: getErrorMessage(),
                            })
                            // eslint-disable-next-line no-empty
                        } catch { }
                    } else {
                        try {
                            interaction.reply({ content: getErrorMessage() })
                            // eslint-disable-next-line no-empty
                        } catch { }
                    }
                    // eslint-disable-next-line no-empty
                } catch (err) {
                    Sentry.captureException(err)
                }
            } finally {
                transaction.finish()
            }
        })
        incrementInteractionCounter('command', commandName)
    } else if (interaction.isButton()) {
        if (typeof command.executeButton != 'function') return
        Sentry.withInteractionScope(interaction, async () => {
            const transaction = Sentry.startTransaction({
                op: command.name + 'Command',
                name: capitaliseSentence(command.name) + ' Command',
            })
            try {
                command.executeButton(client, interaction)
            } catch (error) {
                Sentry.captureException(error)
                // Error running command
                client.logger.error(
                    'interactionHandler: Command button failed with error: ' +
                    error
                )
            } finally {
                transaction.finish()
            }
        })
        incrementInteractionCounter('button', commandName)
    } else if (interaction.isContextMenu()) {
        if (typeof command.executeContextMenu != 'function') return
        Sentry.withInteractionScope(interaction, async () => {
            const transaction = Sentry.startTransaction({
                op: command.name + 'Command',
                name: capitaliseSentence(command.name) + ' Command',
            })
            try {
                command.executeContextMenu(client, interaction)
            } catch (error) {
                // Error running command
                client.logger.error(
                    'interactionHandler: Command button failed with error: ' +
                    error
                )
            } finally {
                transaction.finish()
            }
        })
        incrementInteractionCounter('context_menu', commandName)
    } else if (interaction.isAutocomplete()) {
        if (typeof command.executeAutocomplete != 'function') return
        Sentry.withInteractionScope(interaction, async () => {
            const transaction = Sentry.startTransaction({
                op: command.name + 'Command',
                name: capitaliseSentence(command.name) + ' Command',
            })
            try {
                command.executeAutocomplete(client, interaction)
            } catch (error) {
                // Error running command
                client.logger.error(
                    'interactionHandler: Command button failed with error: ' +
                    error
                )
            } finally {
                transaction.finish()
            }
        })
        incrementInteractionCounter('autocomplete', commandName)
    } else if (interaction.isSelectMenu()) {
        if (typeof command.executeSelectMenu != 'function') return
        Sentry.withInteractionScope(interaction, async () => {
            const transaction = Sentry.startTransaction({
                op: command.name + 'Command',
                name: capitaliseSentence(command.name) + ' Command',
            })
            try {
                command.executeSelectMenu(client, interaction)
            } catch (error) {
                // Error running command
                client.logger.error(
                    'interactionHandler: Command button failed with error: ' +
                    error
                )
            } finally {
                transaction.finish()
            }
        })
        incrementInteractionCounter('select_menu', commandName)
    }
}

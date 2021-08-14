import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { registerCommands, registerEvents } from '../../functions/util'

export const name = 'reload'
export const description = 'Displays debug information'
export const permissions = ['OWNER']
export const usage = 'reload'
export const allowInDm = false
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)

export async function execute(client: BotClient, message: Message, args) {
	try {
		registerCommands(client)
		registerEvents(client)
	} catch (err) {
		return client.logger.error('reloadCommand: Error when registering commands/events: ' + err)
	}
	message.reply('Sucessfully reloaded commands and events')
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	try {
		registerCommands(client)
		registerEvents(client)
	} catch (err) {
		return client.logger.error('reloadCommand: Error when registering commands/events: ' + err)
	}
	interaction.reply({ content: 'Sucessfully reloaded commands and events' })
}

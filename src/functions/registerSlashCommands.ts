/* eslint-disable prefer-const */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = process.env.token
const rest = new REST({ version: '9' }).setToken(token);
import { client } from '../customDefinitions'
/**
 * Registers slash commands with discord
 * @param client Discord client
 */
export default async function register(client: client) {
	client.logger.verbose('Registering slash commands...')
	const commands = client.commands
	let data = []
	let devData = []
	commands.forEach(command => {
		if (command.permissions && command.permissions.includes('OWNER')) {
			devData.push(command.slashData.toJSON())
		} else {
			data.push(command.slashData.toJSON())
		}
	})
	await rest.put(
		Routes.applicationCommands(client.application.id),
		{ body: data },
	)
	if (process.env.devServerId) await rest.put(
		Routes.applicationGuildCommands(client.application.id, process.env.devServerId),
		{ body: devData },
	)
}
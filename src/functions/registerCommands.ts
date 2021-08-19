/* eslint-disable prefer-const */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = process.env.token
const rest = new REST({ version: '9' }).setToken(token);
import { Collection } from 'discord.js';
import { BotClient } from '../customDefinitions'
import fs = require('fs')
/**
 * Registers slash commands with discord
 * @param client Discord client
 */
export async function registerSlashCommands(client: BotClient) {
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
export function registerCommands(client: BotClient) {
	client.commands = new Collection
	const commandFolders = fs.readdirSync('./commands')
	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))
		for (const file of commandFiles) {
			delete require.cache[require.resolve(`../commands/${folder}/${file}`)]
			const command = require(`../commands/${folder}/${file}`)
			client.commands.set(command.name, command)
		}
	}
}
export function registerEvents(client: BotClient) {
	client.events = new Collection
	const commandFiles = fs.readdirSync(`./events`).filter(file => file.endsWith('.js'))
	for (const file of commandFiles) {
		delete require.cache[require.resolve(`../events/${file}`)]
		const event = require(`../events/${file}`)
		client.events.set(event.name, event)
	}
}
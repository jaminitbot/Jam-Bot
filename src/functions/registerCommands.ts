/* eslint-disable prefer-const */
import { REST } from '@discordjs/rest'
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9'
import { Collection } from 'discord.js'
import { BotClient } from '../customDefinitions'

const token = process.env.token
if (!token) throw ('NO TOKEN')
const rest = new REST({version: '9'}).setToken(token)
import fs = require('fs')

/**
 * Registers slash commands with discord
 * @param client Discord client
 */
export async function registerSlashCommands(client: BotClient) {
    const commands = client.commands
    let data: Array<RESTPostAPIApplicationCommandsJSONBody> = []
    let devData: Array<RESTPostAPIApplicationCommandsJSONBody> = []
    commands.forEach((command) => {
        if (typeof command.executeSlash == 'function') {
            if (
                (command.permissions &&
                    command.permissions.includes('OWNER')) ||
                process.env.NODE_ENV != 'production'
            ) {
                devData.push(command.slashData.toJSON())
            } else {
                data.push(command.slashData.toJSON())
            }
        }
        if (typeof command.executeContextMenu == 'function') {
            if (command.interactionType) {
                const interactionData = {
                    name: command.name,
                    type: command.interactionType,
                }
                if (
                    (command.permissions &&
                        command.permissions.includes('OWNER')) ||
                    process.env.NODE_ENV != 'production'
                ) {
                    devData.push(interactionData)
                } else {
                    data.push(interactionData)
                }
            }
        }
    })
    await rest.put(Routes.applicationCommands(client.application.id), {
        body: data,
    })
    if (process.env.devServerId)
        await rest.put(
            Routes.applicationGuildCommands(
                client.application.id,
                process.env.devServerId
            ),
            {body: devData}
        )
}

export function registerCommands(client: BotClient) {
    client.commands = new Collection()
    const commandFolders = fs.readdirSync('./commands')
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`./commands/${folder}`)
            .filter((file) => file.endsWith('.js'))
        for (const file of commandFiles) {
            delete require.cache[
                require.resolve(`../commands/${folder}/${file}`)
                ]
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(`../commands/${folder}/${file}`)
            if (!command.name) continue
            client.commands.set(command.name, command)
        }
    }
}

export function registerEvents(client: BotClient) {
    client.events = new Collection()
    const commandFiles = fs
        .readdirSync(`./events`)
        .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        delete require.cache[require.resolve(`../events/${file}`)]
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const event = require(`../events/${file}`)
        client.events.set(event.name, event)
    }
}

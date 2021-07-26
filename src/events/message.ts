import {checkPermissions, returnInvalidPermissionMessage} from '../functions/util'
import {getKey} from '../functions/db'
import {client} from '../customDefinitions'
import {Message} from 'discord.js'

const messages = require('../functions/messages')
const bannedIds = ['']

export default async function register(client: client, message: Message) {
    if (message.author.bot) return
    if (bannedIds.includes(message.author.id)) return
    const guildId = message.guild ? message.guild.id : 0
    const prefix = await getKey(guildId, 'prefix') || process.env.defaultPrefix
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandRequested = args.shift().toLowerCase()
    const command = client.commands.get(commandRequested) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandRequested));
    if (message.content.startsWith(prefix)) {
        if (!command) return client.logger.debug(`Command ${commandRequested ?? 'NULL'} doesn't exist, not continuing...`)// Doesn't have specified command
        client.logger.verbose(`Command ${commandRequested ?? 'NULL'} has been requested by ${message.author.tag}, executing command...`)
        if (message.channel.type == 'dm' && !command.allowInDm) return message.channel.send('Sorry, that command can only be run in a server!')
        if (command.permissions) {
            if (!checkPermissions(message.member, [...command.permissions])) {
                // User doesn't have specified permissions to run command
                client.logger.debug(`User ${message.author.tag} doesn't have the required permissions to run command ${commandRequested ?? 'NULL'}`)
                return returnInvalidPermissionMessage(message)
            }
        }
        try {
            command.execute(client, message, args)
        } catch (error) {
            // Error running command
            client.logger.error('Command failed with error: ' + error)
            message.reply(messages.getErrorMessage())
        }
    }
}

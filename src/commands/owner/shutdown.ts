import {Message} from "discord.js"
import {client} from '../../customDefinitions'

export const name = 'shutdown'
export const description = 'Gracefully shuts down the bot'
export const usage = 'shutdown'
export const aliases = ['off', 'logoff']
export const permissions = ['OWNER']

export async function execute(client: client, message: Message, args) {
    await message.react('👋')
    await message.channel.send('Shutting Down...')
    // @ts-expect-error
    process.emit('SIGINT')
}

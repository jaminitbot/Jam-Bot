import {CommandInteraction, Message} from "discord.js"
import {client} from '../../customDefinitions'

export const name = 'shutdown'
export const description = 'Gracefully shuts down the bot'
export const usage = 'shutdown'
export const aliases = ['off', 'logoff']
export const permissions = ['OWNER']
export const exposeSlash = false
export async function execute(client: client, message: Message, args) {
    await message.channel.send('Shutting Down...')
    // @ts-expect-error
    process.emit('SIGINT')
}
export async function executeSlash(client, interaction:CommandInteraction) {
    await interaction.reply('Shutting down...')
    // @ts-expect-error
    process.emit('SIGINT')
}
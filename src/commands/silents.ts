import {Message} from "discord.js"
import {client} from '../customDefinitions'
import {Logger} from "winston"

export const name = 'silents'
export const description = 'Silents gaming command'
export const usage = 'silents'
export async function execute(client: client, message: Message, args, logger: Logger) {
    message.channel.send('https://www.youtube.com/embed/yQ0iTDafXuM?autoplay=1')
}

import {Message} from "discord.js"
import {client} from '../customDefinitions'
import {Logger} from "winston"

export const name = 'supersecretwafflecommand'
export const description = 'Shushhhhh'
export const usage = 'supersecretwafflecommand'
import {randomInt} from '../functions/util'
const rickRollCodes = [
    'dQw4w9WgXcQ',
    'iik25wqIuFo',
    'Lrj2Hq7xqQ8',
    'HPk-VhRjNI8',
    'Uj1ykZWtPYI',
    'EE-xtCF3T94',
    'V-_O7nl0Ii0',
    'vkbQmH5MPME',
    '8O_ifyIIrN4',
    'ikFZLI4HLpQ',
    '0SoNH07Slj0'
]
export async function execute(client: client, message: Message, args, logger: Logger) {
    message.channel.send(`<https://youtu.be/${rickRollCodes[randomInt(0, rickRollCodes.length -1)]}>`)
}

import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
const image = require('./image')
import { randomInt } from '../functions/util'

export const name = 'wombat'
export const description = 'Wombat'
export const usage = 'Wombat'
export function execute(client: client, message: Message, args, logger: Logger) {
	const tempArgs = [randomInt(1, 25), 'wombat']
	image.execute(client, message, tempArgs)
}

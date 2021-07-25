import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import { randomInt } from '../../functions/util'

const image = require('./image')

export const name = 'wombat'
export const description = 'Wombat'
export const usage = 'Wombat'
export const allowInDm = true
export function execute(client: client, message: Message, args) {
	const tempArgs = [randomInt(1, 25), 'wombat']
	image.execute(client, message, tempArgs)
}

import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import { randomInt } from '../../functions/util'

const image = require('./image')

export const name = 'melon'
export const description = 'Watermelon'
export const usage = 'melon'
export const allowInDm = true
export function execute(client: client, message: Message, args) {
	const tempArgs = [randomInt(0, 25), 'watermelon'] // eslint-disable-line no-undef
	image.execute(client, message, tempArgs)
}

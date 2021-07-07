import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
import { randomInt } from '../functions/util'

const image = require('./image')
export const name = 'forg'
export const description = 'Frog'
export const usage = 'frog'
export function execute(client: client, message: Message, args) {

	const tempArgs = [randomInt(0, 25), 'frog'] // eslint-disable-line no-undef
	image.execute(client, message, tempArgs)
}

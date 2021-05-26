import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
const image = require('./image')

export const name = 'forg'
export const description = 'Frog'
export const usage = 'frog'
export function execute(client: client, message: Message, args, logger: Logger) {

	const tempArgs = [Math.floor(Math.random() * 25), 'frog'] // eslint-disable-line no-undef
	image.execute(client, message, tempArgs)
}

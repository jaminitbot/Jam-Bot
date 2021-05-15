import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
const image = require('./image')
const random = require('random')

export const name = 'forg'
export const description = 'Frog'
export const usage = 'frog'
export function execute(client: client, message: Message, args, db, logger: Logger) {
	let tempArgs = [random.int(1, 25), 'frog'] // eslint-disable-line no-undef
	image.execute(client, message, tempArgs, db)
}

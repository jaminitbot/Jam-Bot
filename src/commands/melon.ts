import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
const image = require('./image')

export const name = 'melon'
export const description = 'Watermelon'
export const usage = 'melon'
export function execute(client: client, message: Message, args, db, logger: Logger) {
	// @ts-ignore
	let tempArgs = [random.int((min = 1), (max = 25)), 'watermelon'] // eslint-disable-line no-undef
	image.execute(client, message, tempArgs, db)
}

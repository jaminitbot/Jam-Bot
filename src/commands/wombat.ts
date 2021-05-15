import { Message } from "discord.js"
import { client } from '../custom'
import { Logger } from "winston"
const image = require('./image')
const random = require('random')

export const name = 'wombat'
export const description = 'Wombat'
export const usage = 'Wombat'
export function execute(client: client, message: Message, args, db, logger: Logger) {
	let tempArgs = [random.int(1, 25), 'wombat'] // eslint-disable-line no-undef
	image.execute(client, message, tempArgs, db)
}

import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import { randomInt } from '../../functions/util'

const image = require('./image')
export const name = 'frog'
export const description = 'Frog pics'
export const usage = 'frog'
export const aliases = ['forg']
export const allowInDm = true
export function execute(client: client, message: Message, args) {
	const tempArgs = [randomInt(0, 25), 'frog'] // eslint-disable-line no-undef
	image.execute(client, message, tempArgs)
}

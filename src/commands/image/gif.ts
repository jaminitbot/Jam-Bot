import { Message } from "discord.js"
import { client } from '../../customDefinitions'

const image = require('./image')

export const name = 'gif'
export const description = 'Gets a gif'
export const usage = 'gif hello'
export function execute(client: client, message: Message, args) {
	if (!args[0]) return message.reply('you need to specify what to search for!')
	args.push('gif')
	image.execute(client, message, args)
}

import { Message, TextChannel } from "discord.js"
import { client } from '../../customDefinitions'
import {getChannelFromString} from '../../functions/util'

export const name = 'say'
export const description = 'Say'
export const usage = 'say #general Hiiii'
export const permissions = ['OWNER']
export async function execute(client: client, message: Message, args) {
	if (!args[0]) return message.reply('you need to specify a valid channel')
	if (!args[1]) return message.reply('you can\'t say nothing!')
	await message.delete()
	// @ts-expect-error
	const channel: TextChannel = await getChannelFromString(message.guild, args[0])
	if (!(channel.type == 'GUILD_TEXT' || channel.type == 'GUILD_NEWS')) return client.logger.debug('Say Command: Channel wasn\'t a text channel, not continuing')
	const thingToSay = args.splice(1).join(' ')
	channel.send(thingToSay)
}

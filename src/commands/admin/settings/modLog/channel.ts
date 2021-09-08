import { Message, TextChannel } from "discord.js"
import { BotClient } from '../../../../customDefinitions'
import { setKey } from '../../../../functions/db'

export const name = 'channel'
export const description = 'Sets the modlog channel'
export const usage = 'settings modlog channel #modlog'
export async function execute(client: BotClient, message: Message, args: Array<string>) {
	if (!args[2])
		return message.channel.send('You need to specify a channel!')
	const channelInput = args[2].slice(2, -1)
	// @ts-expect-error
	const channel: TextChannel = await client.channels.fetch(channelInput)
	if (!channel || !(channel.type == 'GUILD_TEXT' || channel.type == 'GUILD_NEWS')) return message.channel.send('Not a valid channel!')
	setKey(message.guild.id, 'modLogChannel', channel.id)
	message.channel.send('Set modlog channel!')
	channel.send('Modlogs will be sent here!')
}

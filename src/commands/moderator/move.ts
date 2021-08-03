import { Message, VoiceChannel } from "discord.js"
import { client } from '../../customDefinitions'


import { getChannelFromString } from '../../functions/util'
export const name = 'move'
export const description = 'Moves users from one vc to another'
export const permissions = ['MOVE_MEMBERS']
export const usage = 'move #fromvc #tovc'
export const aliases = ['massmove']
export const slashCommandOptions = [{
	name: 'from',
	type: 'CHANNEL',
	description: 'The channel to move users from',
	required: true
},
	{
		name: 'to',
		type: 'CHANNEL',
		description: 'The channel to move users to',
		required: true
	}]
export async function execute(client: client, message: Message, args) {
	if (!args[0] || !args[1]) return message.channel.send('You need to specify two channels!')
	//@ts-expect-error
	const fromChannel: VoiceChannel = await getChannelFromString(message.guild, args[0])
	//@ts-expect-error
	const toChannel: VoiceChannel = await getChannelFromString(message.guild, args[1])
	if (!fromChannel || !toChannel) return message.channel.send('One of those channels weren\'t valid!')
	if (fromChannel.type != 'GUILD_VOICE' || toChannel.type != 'GUILD_VOICE') return message.channel.send('Both channels need to be a voice channel')
	if (fromChannel.guild.id != message.guild.id || toChannel.guild.id != message.guild.id) return message.channel.send('Hey! You can\'t move people from a VC not in this guild!')
	let count = 0
	fromChannel.members.each(member => {
		count++
		member.voice.setChannel(toChannel, `Bulk moved members from ${fromChannel.name} to ${toChannel.name}. Initiated by ${message.author.tag}`)
	})
	message.channel.send(`Moved ${count} users from <#${fromChannel.id}> to <#${toChannel.id}>!`)
}

import { CommandInteraction, Message, VoiceChannel } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { getChannelFromString } from '../../functions/util'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'move'
export const description = 'Moves users from one vc to another'
export const permissions = ['MOVE_MEMBERS']
export const usage = 'move #fromvc #tovc'
export const aliases = ['massmove']
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addChannelOption(option =>
		option.setName('from')
			.setDescription('The channel to move users from')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('to')
			.setDescription('The channel to move users to')
			.setRequired(true))
async function moveVoiceChannel(fromChannel: VoiceChannel, toChannel: VoiceChannel, guildId: string, intiatingTag: string) {
	if (!fromChannel || !toChannel) return 'One of those channels weren\'t valid!'
	if (fromChannel.type != 'GUILD_VOICE' || toChannel.type != 'GUILD_VOICE') return 'One or more of those channels weren\'t a voice channel!'
	if (fromChannel.guild.id != guildId || toChannel.guild.id != guildId) return 'Hey! Both of the channels need to be in the same server!'
	let count = 0
	try {
		fromChannel.members.each(member => {
			count++
			member.voice.setChannel(toChannel, `Bulk moved members from ${fromChannel.name} to ${toChannel.name}. Initiated by ${intiatingTag}`)
		})
		if (count == 0) {
			return 'There was no users to move.'
		}
	} catch (err) {
		return 'There was an unknown error when trying to perform that action, sorry :('
	}
	return `Successfully moved ${count} user(s) from ${fromChannel.name} to ${toChannel.name}.`
}
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0] || !args[1]) return message.channel.send('You need to specify two channels!')
	//@ts-expect-error
	const fromChannel: VoiceChannel = await getChannelFromString(message.guild, args[0])
	//@ts-expect-error
	const toChannel: VoiceChannel = await getChannelFromString(message.guild, args[1])
	const result = await moveVoiceChannel(fromChannel, toChannel, message.guild.id, message.author.tag)
	message.channel.send(result)
}

export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	// @ts-expect-error
	const fromChannel: VoiceChannel = interaction.options.getChannel('from')
	// @ts-expect-error
	const toChannel: VoiceChannel = interaction.options.getChannel('to')
	const result = await moveVoiceChannel(fromChannel, toChannel, interaction.guild.id, interaction.user.tag)
	interaction.editReply(result)
}

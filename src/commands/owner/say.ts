import { CommandInteraction, Message, TextChannel } from "discord.js"
import { client } from '../../customDefinitions'
import { getChannelFromString } from '../../functions/util'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'say'
export const description = 'Say'
export const usage = 'say #general Hiiii'
export const permissions = ['OWNER']
export const exposeSlash = false
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('message')
			.setDescription('Message to send')
			.setRequired(true))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('(Optional) channel to use')
			.setRequired(false))
async function sayInChannel(thingToSay, channel) {
	if (!(channel.type == 'GUILD_TEXT' || channel.type == 'GUILD_NEWS')) return 'Channel wasn\'t a text channel, not continuing'
	try {
		await channel.send(thingToSay)
		return 'Successfully sent message.'
	} catch (err) {
		return 'Unknown error sending message.'
	}
}
export async function execute(client: client, message: Message, args) {
	// @ts-expect-error
	const channel: TextChannel = await getChannelFromString(message.guild, args[0])
	if (!channel) return message.reply('you need to specify a valid channel')
	if (!args[1]) return message.reply('you can\'t say nothing!')
	await message.delete()
	const thingToSay = args.splice(1).join(' ')
	sayInChannel(thingToSay, channel)
}
export async function executeSlash(client, interaction: CommandInteraction) {
	const thingToSay = interaction.options.getString('message')
	const channel = interaction.options.getChannel('channel') ?? interaction.channel
	interaction.reply({ content: await sayInChannel(thingToSay, channel), ephemeral: true })
}

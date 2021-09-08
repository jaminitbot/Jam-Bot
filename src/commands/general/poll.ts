import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import delay from 'delay'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'poll'
export const description = 'Creates a poll'
export const usage = 'poll Are chips good?'
export const aliases = ['question']
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('question')
			.setDescription('The question for your poll')
			.setRequired(true))
function createPollEmbed(pollContent: string) {
	const embed = new MessageEmbed
	embed.setDescription(pollContent)
	embed.setTimestamp(Date.now())
	embed.setColor('#167C6A')
	return embed
}
export async function execute(client: BotClient, message: Message, args) {
	if (!args[0])
		return message.reply(
			'you need to specify what to make the poll about!'
		)
	await message.delete()
	const text = args.splice(0).join(' ')
	const embed = createPollEmbed(text)
	embed.setFooter(`A poll by ${message.author.tag}`, message.member.user.avatarURL())
	const sent = await message.channel.send({ embeds: [embed] })
	try {
		await sent.react('✅')
		await delay(1010)
		sent.react('❌')
	} catch {
		return
	}

}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const pollContent = interaction.options.getString('question')
	const embed = createPollEmbed(pollContent)
	const sent = await interaction.reply({ embeds: [embed], fetchReply: true })
	try {
		// @ts-expect-error
		await sent.react('✅')
		await delay(1010)
		// @ts-expect-error
		sent.react('❌')
	} catch (err) {
		interaction.followUp({ content: 'I couldn\'t react to this message, check with an admin to see if I have permissions in this channel!', ephemeral: true })
	}

}

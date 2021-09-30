import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import delay from 'delay'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from "i18next"

export const name = 'poll'
export const description = 'Creates a simple yes/no poll'
export const usage = 'poll Are chips tasty?'
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
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	if (!args[0]) return message.reply(i18next.t('poll.NO_ARGUMENTS.SPECIFIED'))
	await message.delete()
	const text = args.splice(0).join(' ')
	const embed = createPollEmbed(text)
	embed.setFooter(i18next.t('poll.POLL_FOOTER', { tag: message.author.tag }), message.author.avatarURL())
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
		interaction.followUp({ content: i18next.t('poll.REACTION_ERROR'), ephemeral: true })
	}

}

import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { uploadToHasteBin } from '../../functions/util'
import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from "i18next"

const secrets = [
	process.env.token,
	process.env.mongoUrl,
	process.env.twitchApiSecret,
	process.env.twitchApiClientId,
	process.env.pexelsApiKey
].filter(Boolean)

const secretsRegex = RegExp(secrets.join('|'), 'g')
export const name = 'eval'
export const description = 'Executes code'
export const usage = 'eval 1+1'
export const permissions = ['OWNER']
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('command')
			.setDescription('The command to run')
			.setRequired(true))
async function runEvalCommand(commandToRun, logger, message) {
	const embed = new MessageEmbed
	embed.setTitle('Eval')
	let commandOutput
	try {
		commandOutput = await eval(commandToRun)
	} catch (error) {
		commandOutput = error
	}
	commandOutput = String(commandOutput)
		.replace(secretsRegex, i18next.t('eval.SECRET'))
	commandOutput = String(commandOutput)
	if (commandToRun.length > 1024) {
		const uploadedHasteLocation = await uploadToHasteBin(logger, commandToRun)
		if (uploadedHasteLocation) {
			embed.addField(i18next.t('eval.COMMAND'), i18next.t('eval.TOO_LARGE_UPLOADED', { context: 'SUCCESS', url: uploadedHasteLocation, type: 'command' }))
		} else {
			embed.addField(i18next.t('eval.COMMAND'), i18next.t('eval.TOO_LARGE_UPLOADED', { context: 'FAILURE', type: 'command' }))
		}
	} else {
		embed.addField(i18next.t('eval.COMMAND'), commandToRun)
	}
	if (commandOutput.length > 1024) {
		const uploadedHasteLocation = await uploadToHasteBin(logger, commandOutput)
		if (uploadedHasteLocation) {
			embed.addField(i18next.t('eval.OUTPUT'), i18next.t('eval.TOO_LARGE_UPLOADED', { context: 'SUCCESS', url: uploadedHasteLocation, type: 'output' }))
		} else {
			embed.addField(i18next.t('eval.OUTPUT'), i18next.t('eval.TOO_LARGE_UPLOADED', { context: 'FAILURE', type: 'output' }))
		}
	} else {
		embed.addField(i18next.t('eval.OUTPUT'), commandOutput)
	}
	return embed
}
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	if (!args[0]) return message.reply(i18next.t('eval.NO_ARGUMENTS_SPECIFIED'))
	const command = args.splice(0).join(' ')
	const sentMessage = await message.channel.send({ content: i18next.t('eval.COMMAND_RUNNING') })
	const embed = await runEvalCommand(command, client.logger, message)
	sentMessage.edit({ content: null, embeds: [embed] })
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	await interaction.deferReply()
	const command = interaction.options.getString('command')
	const embed = await runEvalCommand(command, client.logger, interaction)
	interaction.editReply({ embeds: [embed] })
}

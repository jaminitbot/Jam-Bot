import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { uploadToHasteBin } from '../../functions/util'
import { SlashCommandBuilder } from '@discordjs/builders'

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
		.replace(secretsRegex, '[secret]')
	commandOutput = String(commandOutput)
	if (commandToRun.length > 1024) {
		const uploadedHasteLocation = await uploadToHasteBin(logger, commandToRun)
		if (uploadedHasteLocation) {
			embed.addField('Command', `Command was too large for discord, uploaded to hastebin: ${uploadedHasteLocation}`)
		} else {
			embed.addField('Command', 'Command was too large for discord, but we failed uploading it to hastebin :(')
		}
	} else {
		embed.addField('Command', commandToRun)
	}
	if (commandOutput.length > 1024) {
		const uploadedHasteLocation = await uploadToHasteBin(logger, commandOutput)
		if (uploadedHasteLocation) {
			embed.addField('Output', `Output was too large for discord, uploaded to hastebin: ${uploadedHasteLocation}`)
		} else {
			embed.addField('Output', 'Output was too large for discord, but we failed uploading it to hastebin :(')
		}
	} else {
		embed.addField('Output', commandOutput)
	}
	return embed
}
export async function execute(client: BotClient, message: Message, args, transaction) {
	if (!args[0]) return message.channel.send('Do you just expect me to guess at what you want to run?')
	const command = args.splice(0).join(' ')
	const sentMessage = await message.channel.send({ content: 'Executing command...' })
	const embed = await runEvalCommand(command, client.logger, message)
	sentMessage.edit({ content: null, embeds: [embed] })
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	await interaction.deferReply()
	const command = interaction.options.getString('command')
	const embed = await runEvalCommand(command, client.logger, interaction)
	interaction.editReply({ embeds: [embed] })
}

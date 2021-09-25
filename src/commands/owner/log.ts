import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
const fs = require('fs')
import { uploadToHasteBin } from '../../functions/util'
import i18next from "i18next"
import Sentry from "../../functions/sentry"
import { Logger } from "winston"

export const name = 'log'
export const description = 'Uploads the log for easy viewing'
export const usage = 'log error|combined'
export const aliases = ['uploadlog']
export const permissions = ['OWNER']
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('type')
			.setDescription('The type of log (combined/error)')
			.setRequired(false))
function uploadLog(logPath: string, logger: Logger) {
	if (!logPath) {
		logPath = 'combined.log'
	} else if (logPath != 'error' && logPath != 'combined') {
		return i18next.t('log.INVALID_LOG_TYPE')
	} else {
		logPath += '.log'
	}
	fs.readFile(logPath, 'utf8', async function (err, data) {
		if (err) {
			Sentry.captureException(err)
		}
		if (!data) return i18next.t('log.LOG_EMPTY')
		const uploadedPasteLocation = await uploadToHasteBin(logger, data)
		if (uploadedPasteLocation) {
			return i18next.t('log.UPLOAD_SUCCESS', { url: uploadedPasteLocation })
		} else {
			return i18next.t('general:UNKNOWN_ERROR')
		}
	});
}
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	const logFilePath = args[0]?.toString().toLowerCase()
	message.channel.send(uploadLog(logFilePath, client.logger))
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const logFilePath = interaction.options.getString('type')
	interaction.reply({ content: uploadLog(logFilePath, client.logger) })
}
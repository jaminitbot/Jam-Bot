import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import dayjs from "dayjs"
import i18next from "i18next"

export const name = 'uptime'
export const description = "Displays the bot's uptime"
export const usage = 'uptime'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	const timeDate = dayjs(client.uptime).format("HH:mm:ss [-] DD/MM/YYYY")
	message.channel.send(i18next.t('uptime.UPTIME_MESSAGE', { date: timeDate }))
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const timeDate = dayjs(client.uptime).format("HH:mm:ss [-] DD/MM/YYYY")
	interaction.reply(i18next.t('uptime.UPTIME_MESSAGE', { date: timeDate }))
}

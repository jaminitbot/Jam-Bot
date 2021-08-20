import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import dayjs from "dayjs"

export const name = 'uptime'
export const description = "Displays the bot's current uptime"
export const usage = 'uptime'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
export async function execute(client: BotClient, message: Message, args) {
	const TimeDate = dayjs().format("DD:MM:YYYY [-] hh:mm:ss a")
	message.channel.send('The bot has been up since: ' + TimeDate)
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const TimeDate = dayjs().format("DD:MM:YYYY [-] hh:mm:ss a")
	interaction.reply('The bot has been up since: ' + TimeDate)
}

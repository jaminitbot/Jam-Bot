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
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	const timeDate = dayjs().format("HH:mm:ss [-] DD/MM/YYYY")
	message.channel.send('The bot has been up since: ' + timeDate)
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const timeDate = dayjs().format("HH:mm:ss [-] DD/MM/YYYY")
	interaction.reply('The bot has been up since: ' + timeDate)
}

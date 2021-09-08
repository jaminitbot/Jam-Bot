import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'owner'
export const description = 'Displays the owner of the bot'
export const usage = 'owner'
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
export async function execute(client: BotClient, message: Message, args) {
	message.channel.send(process.env.ownerName ?? 'Appears to be unknown')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	interaction.reply(process.env.ownerName ?? 'Appears to be unknown')
}
import { CommandInteraction, Message, MessageEmbed } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { getKey } from '../../functions/db'
import { SlashCommandBuilder } from '@discordjs/builders'

const isNumber = require('is-number')

export const name = 'getkey'
export const description = 'Gets a db key'
export const usage = 'getkey 4569844357398443 blah'
export const permissions = ['OWNER']
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('key')
			.setDescription('The key to get')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('guild')
			.setDescription('Guild ID')
			.setRequired(false))
async function returnGetKeyEmbed(guild, key) {
	const valueReturned = String(await getKey(guild, key))
	const embed = new MessageEmbed
	embed.setTitle('GetKey')
	embed.addField('Guild', guild, true)
	embed.addField('Key', key, true)
	embed.addField('Value', valueReturned, true)
	embed.setTimestamp(Date.now())
	return embed
}
export async function execute(client: BotClient, message: Message, args, transaction) {
	let guild
	let key
	if (!isNumber(args[0]) && !args[1]) { // Getting key without guild input
		guild = message.guild.id // Use current guild
		key = args[0]
	} else if (isNumber(args[0]) && !args[1]) { // Guild ID inputted but no key to get
		return message.reply('You need to input a value to set!')
	} else { // Using guild id
		guild = args[0]
		key = args[1]
	}
	const embed = await returnGetKeyEmbed(guild, key)
	embed.setFooter(`Initiated by ${message.author.tag}`, message.author.displayAvatarURL())
	message.channel.send({ embeds: [embed] })
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	const guildId = interaction.options.getString('guildid') ?? interaction.guild.id
	const key = interaction.options.getString('key')
	const embed = await returnGetKeyEmbed(guildId, key)
	interaction.reply({ embeds: [embed] })
}
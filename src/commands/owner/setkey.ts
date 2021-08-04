import {CommandInteraction, Message, MessageEmbed} from "discord.js"
import { client } from '../../customDefinitions'
import { setKey } from '../../functions/db'

const isNumber = require('is-number')

export const name = 'setkey'
export const description = 'Sets a db key'
export const usage = 'setkey 46435456789132 blah test'
export const permissions = ['OWNER']
export const exposeSlash = false
export const slashCommandOptions = [{
	name: 'guildid',
	type: 'INTEGER',
	description: '(Optional) guild id',
	required: false
},
	{
		name: 'key',
		type: 'STRING',
		description: 'Key to set',
		required: true
	},
	{
		name: 'value',
		type: 'STRING',
		description: 'Value to set',
		required: true
	}]
async function returnSetKeyEmbed(guildId, key, value) {
	try {
		await setKey(guildId, key, value)
	} catch(err) {
		const embed = new MessageEmbed()
		embed.setDescription('Something went wrong :(')
		return embed
	}
	const embed = new MessageEmbed
	embed.setTitle('SetKey')
	embed.setDescription('Successfully set key')
	embed.addField('Guild', guildId, true)
	embed.addField('Key', key, true)
	embed.addField('Value', value, true)
	embed.setTimestamp(Date.now())
	return embed
}
export async function execute(client: client, message: Message, args) {
	let guild
	let key
	let value
	if (!isNumber(args[0]) && !args[2]) { // Setting key without guild input
		guild = message.guild.id // Use current guild
		key = args[0]
		value = args[1]
	} else if (isNumber(args[0]) && !args[2]) { // Guild ID inputted but no value to set
		return message.reply('You need to input a value to set!')
	} else { // Using guild id
		guild = args[0]
		key = args[1]
		value = args[2]
	}
	const embed = await returnSetKeyEmbed(guild, key, value)
	embed.setFooter(`Intiated by ${message.author.tag}`, message.author.displayAvatarURL())
	message.channel.send({embeds: [embed]})
}
export async function executeSlash(client, interaction:CommandInteraction) {
	const guildId = interaction.options.getInteger('guildid') ?? interaction.guild.id
	const key = interaction.options.getString('key')
	const value = interaction.options.getString('value')
	const embed = await returnSetKeyEmbed(guildId, key, value)
	interaction.reply({embeds: [embed]})
}
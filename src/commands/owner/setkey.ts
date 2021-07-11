import { Message, MessageEmbed } from "discord.js"
import { client } from '../../customDefinitions'
import { setKey } from '../../functions/db'

const isNumber = require('is-number')

export const name = 'setkey'
export const description = 'Sets a db key'
export const usage = 'setkey 46435456789132 blah test'
export async function execute(client: client, message: Message, args) {
	if (message.author.id !== process.env.OWNERID) return
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
	const result: boolean = await setKey(guild, key, value)
	if (result) {
		const embed = new MessageEmbed
		embed.setTitle('SetKey')
		embed.setDescription('Successfully set key')
		embed.addField('Guild', guild, true)
		embed.addField('Key', key, true)
		embed.addField('Value', value, true)
		embed.setFooter(`Intiated by ${message.author.tag}`, message.author.displayAvatarURL())
		embed.setTimestamp(Date.now())
		message.channel.send(embed)
	} else {
		message.channel.send('Oops, that didn\'t work!')
	}
}

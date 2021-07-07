import { Message, MessageEmbed } from "discord.js"
import { client } from '../customDefinitions'
import { getKey } from '../functions/db'

const isNumber = require('is-number')

export const name = 'getkey'
export const description = 'Gets a db key'
export const usage = 'getkey 4569844357398443 blah'
export async function execute(client: client, message: Message, args) {
	if (message.author.id !== process.env.OWNERID) return
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
	const valueReturned = String(await getKey(guild, key))
	const embed = new MessageEmbed
	embed.setTitle('GetKey')
	embed.addField('Guild', guild, true)
	embed.addField('Key', key, true)
	embed.addField('Value', valueReturned, true)
	embed.setFooter(`Intiated by ${message.author.tag}`, message.author.displayAvatarURL())
	embed.setTimestamp(Date.now())
	message.channel.send(embed)
}

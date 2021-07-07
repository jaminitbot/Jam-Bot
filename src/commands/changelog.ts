import { Message, MessageEmbed } from "discord.js"
import { client } from '../customDefinitions'


import fetch from 'node-fetch'
export const name = 'changelog'
export const description = 'Displays the latest changes to the bot'
export const usage = 'changelog'
export async function execute(client: client, message: Message, args) {
	if (!process.env.changelogLink) return message.channel.send('No changelog URL specified :(')
	const sentMessage = await message.channel.send('Loading changelog...')
	const embed = new MessageEmbed()
	embed.setTitle('Changelog')
	let log
	try {
		log = await fetch(process.env.changelogLink).then((response) => response.json())
	} catch (e) {
		embed.setDescription('There was an error downloading the changelog, sorry about that :(')
		return sentMessage.edit({ content: null, embed: embed })
	}
	if (!args[0]) {
		let count = 0
		for (let i = log.length - 1; i >= 0; i -= 1) {
			count++
			embed.addField(`Change #${i + 1}: ${log[i].title}`, log[i].description)
			if (count == 3) break
		}

	} else {
		if (log[args[0] - 1]) {
			embed.addField(`Change ${args[0]}: ${log[args[0] - 1].title}`, log[args[0] - 1].description)
		} else {
			embed.setDescription('There wasn\'t a changelog for position: ' + args[0])
			return sentMessage.edit({ content: null, embed: embed })
		}
	}
	if (process.env.repoLink) embed.setDescription(`More comprehensive changelogs can be found [here](${process.env.repoLink}/commits/)`)
	embed.setTimestamp(Date.now())
	sentMessage.edit({ content: null, embed: embed })
}

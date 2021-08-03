import { Message, MessageEmbed } from "discord.js"
import { client } from '../../customDefinitions'


import fetch from 'node-fetch'
import NodeCache from "node-cache"
const cache = new NodeCache({stdTTL:60, checkperiod:30})

function generateDateFromEntry(entry) {
	if (!entry) throw new Error('No entry specified')
	if (entry.date) {
		return `<t:${Math.floor(entry.date / 1000)}:R>`
	} else {
		return 'N/A'
	}
}

export const name = 'changelog'
export const description = 'Displays the latest changes to the bot'
export const usage = 'changelog'
export const aliases = ['changes', 'change']
export const allowInDm = true
export const slashCommandOptions = [{
	name: 'changeid',
	type: 'INTEGER',
	description: '(Optional) the specific change you\'d like to get',
	required: false
}]
export async function execute(client: client, message: Message, args) {
	if (!process.env.changelogLink) return message.channel.send('No changelog URL specified :(')
	const sentMessage = await message.channel.send('Loading changelog...')
	const embed = new MessageEmbed()
	embed.setTitle('Changelog')
	let log = cache.get('log')
	if (!log) {
		client.logger.debug('Cache not hit, attempting to retrieve changelog from github...')
		try {
			log = await fetch(process.env.changelogLink).then((response) => response.json())
			cache.set('log', log)
		} catch (e) {
			embed.setDescription('There was an error downloading the changelog, sorry about that :(')
			return sentMessage.edit({ content: null, embeds: [embed] })
		}
	}

	if (!args[0]) {
		let count = 0
		// @ts-ignore
		for (let i = log.length - 1; i >= 0; i -= 1) {
			count++
			embed.addField(`Change #${i + 1}: ${log[i].title}`, `Changed: ${generateDateFromEntry(log[i])} \n${log[i].description}`)
			if (count == 3) break
		}
	} else {
		if (log[args[0] - 1]) {
			embed.addField(`Change ${args[0]}: ${log[args[0] - 1].title}`, `Changed: ${generateDateFromEntry(log[args[0] - 1])} \n${log[args[0] - 1].description}`)
		} else {
			embed.setDescription('There wasn\'t a changelog for position: ' + args[0])
			return sentMessage.edit({ content: null, embeds: [embed] })
		}
	}
	embed.setDescription(`More comprehensive changelogs can be found [here](https://jambot.jaminit.co.uk/#/changelog)`)
	sentMessage.edit({ content: null, embeds: [embed] })
}

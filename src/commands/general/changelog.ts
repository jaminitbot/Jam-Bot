import { CommandInteraction, Guild, Message, MessageEmbed, User } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { request } from 'undici'
import NodeCache from "node-cache"
import { Logger } from "winston"
import Sentry from '../../functions/sentry'
const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 })

function generateDateFromEntry(entry) {
	if (!entry) throw new Error('No entry specified')
	if (entry.date) {
		return `<t:${Math.floor(entry.date / 1000)}:R>`
	} else {
		return 'N/A'
	}
}
interface ChangelogEntry {
	title: string
	description: string
	date: number | undefined
}
type ChangelogResponse = Array<ChangelogEntry>

export const name = 'changelog'
export const description = 'Displays the latest changes to the bot'
export const usage = 'changelog'
export const aliases = ['changes', 'change']
export const allowInDm = true
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addIntegerOption(option =>
		option.setName('changeid')
			.setDescription('The specific change you\'d like to get')
			.setRequired(false))
async function returnChangelogEmbed(changeNumber = null, logger: Logger, user: User, guild: Guild, type: string, transaction) {
	const embed = new MessageEmbed()
	embed.setTitle('Changelog')
	if (!process.env.changelogLink) {
		embed.setDescription('No changelog URL specified :(')
		return [embed, true]
	}
	let log: ChangelogResponse = cache.get('log')
	if (!log) {
		logger.debug('Cache not hit, attempting to retrieve changelog from github...')
		const response = await request(process.env.changelogLink)
		if (response.statusCode != 200) {
			logger.warn('changelog: github seems to be returning non-standard status codes')
			embed.setDescription('There was an error downloading the changelog, sorry about that :(')
			Sentry.captureMessage('Github returned non-standard status code')
			return [embed, true]
		}
		log = await response.body.json()
		cache.set('log', log)
	}
	if (!changeNumber) {
		let count = 0
		// @ts-ignore
		for (let i = log.length - 1; i >= 0; i -= 1) {
			count++
			embed.addField(`Change #${i + 1}: ${log[i].title}`, `Changed: ${generateDateFromEntry(log[i])}\n${log[i].description}`)
			if (count == 3) break
		}
	} else {
		if (log[changeNumber - 1]) {
			embed.addField(`Change ${changeNumber}: ${log[changeNumber - 1].title}`, `Changed: ${generateDateFromEntry(log[changeNumber - 1])} \n${log[changeNumber - 1].description}`)
		} else {
			embed.setDescription('There wasn\'t a changelog for position: ' + changeNumber)
			return [embed, false]
		}
	}
	embed.setDescription(`More comprehensive changelogs can be found [here](https://jambot.jaminit.co.uk/#/changelog)`)
	return [embed, false]
}
export async function execute(client: BotClient, message: Message, args: Array<unknown>, transaction) {
	message.channel.send('This command can only be used with slash commands.')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction, transaction) {
	const changelogEntryNumber = interaction.options.getInteger('changeid')
	const embedObject = await returnChangelogEmbed(changelogEntryNumber, client.logger, interaction.user, interaction.guild, 'slash', transaction)
	// @ts-expect-error
	await interaction.reply({ embeds: [embedObject[0]], ephemeral: embedObject[1] })
}
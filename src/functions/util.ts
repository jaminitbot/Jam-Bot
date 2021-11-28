import { GuildMember, Message, Guild, Channel, Role, GuildChannel, ThreadChannel } from 'discord.js'
import { BotClient, Permission } from '../customDefinitions'
import { getInvalidPermissionsMessage } from './messages'
import is_number = require('is-number')
import { request } from 'undici'
import { Logger } from 'winston'
import i18next from 'i18next'
import db from './db'

/**
 * Checks permissions against a guild member
 * @param member Guild member to check
 * @param permissions Permissions required
 * @returns Boolean
 */
export function checkPermissions(
	member: GuildMember,
	permissions: Array<Permission>
): boolean {
	let validPermission = true
	if (permissions.includes('OWNER')) {
		permissions = removeItemFromArray(permissions, 'OWNER')
		if (!isBotOwner(member.id)) validPermission = false
	}
	if (permissions.length != 0) {
		// @ts-expect-error
		if (!member.permissions.has(permissions)) validPermission = false
	}
	return validPermission
}

/**
 * Stops the bot and services gracefully
 * @param client Discordjs Client
 * @param mongoClient Mongo db client
 * @param stopCode Process exit code, default 0
 */
export async function stopBot(
	client: BotClient | null,
	stopCode = 0
): Promise<void> {
	try {
		if (client) {
			client.logger.warn(
				'util: Received call to stop bot, stopping with code: ' +
				stopCode
			)
			client.destroy()
		}
		await db.$disconnect()
		process.exit(stopCode)
	} catch {
		process.exit()
	}
}

/**
 * Generates a random number between two values
 * @param min Minimum number (inclusive)
 * @param max Maximum number (inclusive)
 * @returns Random number
 */
export function randomInt(min: number, max: number): number {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

/**
 *
 * @param message Initiating message
 */
export function returnInvalidPermissionMessage(message: Message): void {
	message.react('❌')
	message.channel.send(getInvalidPermissionsMessage())
}

/**
 * Returns a user from a string, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get the user from
 * @returns GuildMember
 */
export async function getUserFromString(
	guild: Guild,
	text: unknown
): Promise<GuildMember | null> {
	try {
		if (!text) return null
		let stringText = String(text)
		if (stringText.startsWith('<@') && stringText.endsWith('>')) {
			// Mention
			stringText = stringText.slice(2, -1)
			if (stringText.startsWith('!')) {
				stringText = stringText.slice(1)
			}
			if (stringText.startsWith('&')) {
				// Role
				return null
			}
			if (stringText.startsWith('<#')) {
				// Channel
				return null
			}
			return await guild.members.fetch(stringText)
		} else if (is_number(text)) {
			// Plain ID
			return await guild.members.fetch(stringText)
		}
	} catch {
		// eslint-disable-next-line no-empty
	}
	return null
}

/**
 * Returns a user from a string, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get the user from
 * @returns GuildMember
 */
export async function getRoleFromString(
	guild: Guild,
	text: unknown
): Promise<Role | null> {
	try {
		if (!text) return null
		let stringText = String(text)
		if (stringText.startsWith('<@') && stringText.endsWith('>')) {
			// Mention
			stringText = stringText.slice(2, -1)
			if (stringText.startsWith('<#')) {
				// Channel
				return null
			}
			if (stringText.startsWith('&')) {
				// Role
				stringText = stringText.slice(1)
			}

			return await guild.roles.fetch(stringText)
		} else if (is_number(stringText)) {
			// Plain ID
			return await guild.roles.fetch(stringText)
		}
	} catch {
		// eslint-disable-next-line no-empty
	}
	return null
}

/**
 * Returns a channel from a string of text, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get channel from
 * @returns Channel
 */
export async function getChannelFromString(
	guild: Guild,
	text: unknown
): Promise<Channel | ThreadChannel | GuildChannel | null | undefined> {
	try {
		if (!text) return null
		let stringText = String(text)
		if (stringText.startsWith('<@')) {
			// User or role
			return null
		}
		if (stringText.startsWith('<#') && stringText.endsWith('>')) {
			stringText = stringText.slice(2, -1)
			return await guild.client.channels.fetch(stringText)
		} else if (is_number(stringText)) {
			return await guild.client.channels.fetch(stringText)
		} else {
			return guild.channels.cache.find(
				(channel) => channel.name.toLowerCase() === stringText
			)
		}
	} catch {
		return null
	}
}

/**
 * Uploads text to a hastebin host
 * @param logger OPTIONAL winston logger
 * @param dataToUpload Text to upload
 * @returns string Uploaded paste location
 */
export async function uploadToHasteBin(
	logger: Logger,
	dataToUpload: string
): Promise<string | null> {
	if (!dataToUpload) {
		if (logger)
			logger.error(
				'hasteUploader: No content provided to upload, skipping...'
			)
	}
	const hasteLocation = process.env.hasteBinHost ?? 'https://hastebin.com'
	try {
		const response = await request(hasteLocation + '/documents', {
			method: 'POST',
			body: dataToUpload,
		})
		if (response.statusCode != 200) return null
		const responseData = await response.body.json()
		if (responseData.key) return `${hasteLocation}/${responseData.key}`
	} catch (err) {
		if (logger)
			logger.error(
				'hasteUploader: Failed uploading to hastebin with error: ' + err
			)
	}
	return null
}

/**
 * Removes a specified value from an array
 * @param arr Array to perform on
 * @param value Value to remove
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeItemFromArray(arr: Array<any>, value: unknown) {
	let i = 0
	while (i < arr.length) {
		if (arr[i] == value) {
			arr.splice(i, 1)
		} else {
			++i
		}
	}
	return arr
}

/**
 * Checks if a user ID is one of the bot owners
 * @param userId User ID to check
 * @returns Boolean
 */
export function isBotOwner(userId: string) {
	const owners = String(process.env.ownerId).split(',')
	return owners.includes(userId)
}
let thisLogger: Logger
export const saveLogger = (logger: Logger) => {
	thisLogger = logger
}
export const getLogger = () => {
	return thisLogger
}

/**
 * Capitalises the first letter of a sentence
 * @param string Input string
 * @returns string
 */
export function capitaliseSentence(string: string) {
	if (!string) return null
	const str = String(string)
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export function booleanToHuman(booleanToConvert: boolean) {
	if (booleanToConvert == true) {
		return i18next.t('misc:ON')
	} else {
		return i18next.t('misc:OFF')
	}
}

export async function delay(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time))
}

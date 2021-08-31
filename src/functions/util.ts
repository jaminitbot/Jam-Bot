import { GuildMember, Message, Guild, Channel, Role } from "discord.js"
import { MongoClient } from "mongodb"
import { BotClient, Permission } from "../customDefinitions"
import { getInvalidPermissionsMessage } from './messages'
import is_number = require("is-number");
import fetch from "node-fetch";
import { Logger } from "winston";
/**
 * Checks permissions against a guild member
 * @param member Guild member to check
 * @param permissions Permissions required
 * @returns Boolean
 */
export function checkPermissions(member: GuildMember, permissions: Array<Permission>): boolean {
	let validPermission = true
	if (permissions.includes('OWNER')) {
		permissions = removeItemFromArray(permissions, 'OWNER')
		const owners = process.env.ownerId.split(',')
		if (!owners.includes(member.id)) validPermission = false
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
export async function stopBot(client: BotClient, mongoClient: MongoClient, stopCode = 0): Promise<void> {
	try {
		if (client) {
			client.logger.warn('util: Received call to stop bot, stopping with code: ' + stopCode)
			client.destroy()
		}
		if (mongoClient) {
			await mongoClient.close()
		}
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
export async function getUserFromString(guild: Guild, text: string): Promise<GuildMember> {
	try {
		if (!text) return null
		if (text.startsWith('<@') && text.endsWith('>')) { // Mention
			text = text.slice(2, -1);
			if (text.startsWith('!')) {
				text = text.slice(1);
			}
			if (text.startsWith('&')) { // Role
				return null
			}
			if (text.startsWith('<#')) { // Channel
				return null
			}
			return await guild.members.fetch(text)
		} else if (is_number(text)) { // Plain ID
			return await guild.members.fetch(text)
		}
	} catch (e) {
		// eslint-disable-next-line no-empty
		{ }
	}
	return null
}

/**
 * Returns a user from a string, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get the user from
 * @returns GuildMember
 */
 export async function getRoleFromString(guild: Guild, text: string): Promise<Role> {
	try {
		if (!text) return null
		if (text.startsWith('<@') && text.endsWith('>')) { // Mention
			text = text.slice(2, -1);
			if (text.startsWith('<#')) { // Channel
				return null
			}
			if (text.startsWith('&')) { // Role
				text = text.slice(1)
			}
			
			return await guild.roles.fetch(text)
		} else if (is_number(text)) { // Plain ID
			return await guild.roles.fetch(text)
		}
	} catch (e) {
		// eslint-disable-next-line no-empty
		{ }
	}
	return null
}
/**
 * Returns a channel from a string of text, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get channel from
 * @returns Channel
 */
export async function getChannelFromString(guild: Guild, text: string): Promise<Channel> {
	try {
		if (!text) return null
		if (text.startsWith('<@')) { // User or role
			return null
		}
		if (text.startsWith('<#') && text.endsWith('>')) {
			text = text.slice(2, -1);
			return await guild.client.channels.fetch(text)
		} else if (is_number(text)) {
			return await guild.client.channels.fetch(text)
		} else {
			return guild.channels.cache.find(
				channel => channel.name.toLowerCase() === text
			)
		}
	} catch (e) {
		return null
	}
}

/**
 * Uploads text to a hastebin host
 * @param logger OPTIONAL winston logger
 * @param dataToUpload Text to upload
 * @returns string Uploaded paste location
 */
export async function uploadToHasteBin(logger: Logger, dataToUpload: string): Promise<string> {
	if (!dataToUpload) {
		if (logger) logger.error('hasteUploader: No content provided to upload, skipping...')
	}
	const hasteLocation = process.env.hasteBinHost ?? 'https://hastebin.com'
	try {
		const response = await fetch(hasteLocation + '/documents', {
			method: 'POST',
			body: dataToUpload,
		}).then((r) => r.json())
		if (response.key) return `${hasteLocation}/${response.key}`
	} catch (err) {
		if (logger) logger.error('hasteUploader: Failed uploading to hastebin with error: ' + err)
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
	let i = 0;
	while (i < arr.length) {
		if (arr[i] === value) {
			arr.splice(i, 1);
		} else {
			++i;
		}
	}
	return arr;
}
export function isBotOwner(userId:string) {
	const owners = process.env.ownerId.split(',')
	return owners.includes(userId)
}
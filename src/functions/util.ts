import {GuildMember, PermissionString, Message, Guild, GuildChannel, Channel} from "discord.js"
import {MongoClient} from "mongodb"
import {client} from "../customDefinitions"
import {getInvalidPermissionsMessage} from './messages'
import is_number = require("is-number");
/**
 * 
 * @param member Guild member to check
 * @param permissions Permissions required
 * @returns Boolean
 */
export function checkPermissions(member: GuildMember, permissions: Array<PermissionString>): boolean {
	return member.hasPermission(permissions) || member.id == process.env.OWNERID;

}
/**
 *
 * @param client Discordjs Client
 * @param mongoClient Mongo db client
 * @param stopCode Process exit code, default 0
 */
export async function stopBot(client: client, mongoClient: MongoClient, stopCode = 0) {
	try {
		if (client) {
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
 * 
 * @param min Minimum number (inclusive)
 * @param max Maximum number (inclusive)
 * @returns Random number 
 */
export function randomInt(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

/**
 *
 * @param message Initiating message
 */
export function returnInvalidPermissionMessage(message:Message) {
	message.react('❌')
	message.channel.send(getInvalidPermissionsMessage())
}

/**
 * Returns a user from a string
 * @param guild Guild object
 * @param text Text to get the user from
 * @returns GuildMember
 */
export async function getUserFromString(guild:Guild, text:string):Promise<GuildMember> {
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
			return await guild.members.fetch(text)
		} else if (is_number(text)) { // Plain ID
			return await guild.members.fetch(text)
		}
	} catch(e) {
		return null
	}

}

export async function getChannelFromString(guild:Guild, text:string):Promise<unknown> {
	try {
		if (!text) return null
		if (text.startsWith('<#') && text.endsWith('>')) {
			text = text.slice(2, -1);
			return await guild.client.channels.fetch(text);
		} else if (is_number(text)) {
			return await guild.client.channels.fetch(text);
		} else {
			return guild.channels.cache.find(
				channel => channel.name.toLowerCase() === text
			)
		}
	} catch(e) {
		return null
	}
}
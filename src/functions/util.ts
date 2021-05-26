import { GuildMember, PermissionString } from "discord.js"
import { MongoClient } from "mongodb"
import { client } from "../customDefinitions"
/**
 * 
 * @param member Guild member to check
 * @param permissions Permissions required
 * @returns Boolean
 */
export function checkperm(member: GuildMember, permissions: Array<PermissionString>): boolean {
	if (
		member.hasPermission(permissions) ||
		member.id == process.env.OWNERID
	) {
		return true
	}
	return false
}
/**
 * 
 * @param client Discordjs Client
 * @param mongoClient Mongo db client
 * @param stopCode Process exit code, default 0
 */
export function stopBot(client: client, mongoClient: MongoClient, stopCode = 0): undefined {
	try {
		if (client) {
			client.destroy()
		}
		if (mongoClient) {
			mongoClient.close()
		}
		process.exit(stopCode)
	} catch {
		process.exit()
	}
}
/**
 * 
 * @param min Minium number (inclusive)
 * @param max Maximum number (inclusive)
 * @returns Random number 
 */
export function randomInt(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}
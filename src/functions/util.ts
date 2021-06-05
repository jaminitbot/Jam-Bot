import { GuildMember, PermissionString } from "discord.js"
import { MongoClient } from "mongodb"
import { client } from "../customDefinitions"
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
import { GuildMember, PermissionString } from "discord.js"
import { MongoClient } from "mongodb"
import { client } from "../custom"
/**
 * 
 * @param member Guild member to check
 * @param permissions Permissions required
 * @returns Boolean
 */
export function checkperm(member: GuildMember, permissions: Array<PermissionString>) {
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
export function stopBot(client: client, mongoClient: MongoClient, stopCode: number = 0) {
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
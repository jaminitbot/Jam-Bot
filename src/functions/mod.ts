import { Channel, Guild, GuildMember, MessageOptions } from "discord.js"
import { BotClient } from "../customDefinitions"
import { getNestedSetting, returnRawClient } from './db'
import ms from 'ms'
import is_number from "is-number"
import { capitaliseSentence } from "./util"

type TaskType = 'UNMUTE' | 'UNBAN'

export function parseDuration(duration: string) {
	if (!duration) return null
	const durationArray = String(duration).split(' ')
	let parsedDuration = 0
	let count = 0
	while (count < durationArray.length) {
		let splitDuration
		if (is_number(durationArray[count])) {
			if (!durationArray[count + 1] || typeof durationArray[count + 1] != 'string') return null
			splitDuration = durationArray[count] + " " + durationArray[count + 1]
			count += 2
		} else {
			splitDuration = durationArray[count]
			count++
		}
		const tempDuration = parseInt(ms(splitDuration))
		if (!tempDuration) return null
		parsedDuration += tempDuration
	}
	return parsedDuration
}
type LogType = 'messages' | 'members' | 'server' | 'joinLeaves'
export async function postToModlog(client: BotClient, guildId: string, messageContent: string | MessageOptions, logType: LogType) {
	const shouldLog = await getNestedSetting(guildId, 'modlog', 'log' + capitaliseSentence(logType))
	if (!shouldLog) return 5
	let channelId = await getNestedSetting(guildId, 'modlog', logType + 'ChannelId')
	if (!channelId) {
		channelId = await getNestedSetting(guildId, 'modlog', 'mainChannelId')
		if (!channelId) return 4
	}
	let channel: Channel
	try {
		channel = await client.channels.fetch(channelId)
	} catch {
		return 1
	}
	if (!channel) return 1
	if (!channel.isText) return 2
	try {
		// @ts-expect-error
		await channel.send(messageContent)
	} catch {
		return 3
	}
	return 0
}

export async function scheduleTask(guildId: string, targetId: string, type: TaskType, duration: number) {
	const collection = returnRawClient().db(process.env.databaseName).collection('tasks')
	try {
		await collection.insertOne({ guildId: guildId, targetId: targetId, type: type, time: Date.now() + duration })
	} catch {
		return 1
	}
	return 0
}

export async function processTasks(client: BotClient) {
	const collection = returnRawClient().db(process.env.databaseName).collection('tasks')
	// @ts-expect-error
	collection.find().forEach(async task => {
		if (task.time < Date.now()) {
			const guild = await client.guilds.fetch(task.guildId)
			let successful = true
			if (guild) {
				switch (task.type) {
					case 'UNMUTE':
						if (!guild.me.permissions.has('MANAGE_ROLES')) {
							successful = false
						} else {
							unmute(guild, task.targetId, client.user.id, 'Automatically unmuted.')
						}
						break
					case 'UNBAN':
						if (!guild.me.permissions.has('BAN_MEMBERS')) {
							successful = false
						} else {
							unban(guild, task.targetId, client.user.id, 'Automatically unbanned.')
						}
						break
				}
			}
			if (successful) collection.deleteOne({ _id: task._id })
		}
	})
}

export async function ban(guild: Guild, userId: string, modId: string, reason: string | null, duration: number | null) {
	const target = await guild.members.fetch(userId)
	if (!target) return 1
	try {
		await target.ban({ reason: reason, days: 1 })
	} catch {
		return 1 // Unknown error
	}
	if (duration) {
		await scheduleTask(guild.id, target.id, 'UNBAN', duration)
	}
	return 0
}

export async function unban(guild: Guild, userId: string, modId: string, reason: string) {
	try {
		await guild.bans.remove(userId)
	} catch {
		return 2
	}
	return 0
}

export async function kick(guild: Guild, userId: string, modId: string, reason: string | null) {
	const target = await guild.members.fetch(userId)
	if (!target) return 1
	try {
		await target.kick(reason)
	} catch {
		return 1 // Unknown error
	}
	return 0
}

export async function mute(guild: Guild, userId: string, modId: string, reason: string | null, duration: number | null) {
	const target = await guild.members.fetch(userId)
	if (!target) return 1
	const role = guild.roles.cache.find(role => role.name == 'Muted')
	if (!role) return 3
	try {
		await target.roles.add(role)
	} catch {
		return 1
	}
	if (duration) {
		await scheduleTask(guild.id, target.id, 'UNMUTE', duration)
	}
	return 0
}

export async function unmute(guild: Guild, userId: string, modId: string, reason: string | null) {
	const target = await guild.members.fetch(userId)
	if (!target) return 1
	const role = guild.roles.cache.find(role => role.name == 'Muted')
	if (!role) return 3
	try {
		await target.roles.remove(role)
	} catch {
		return 1
	}
	return 0
}

export async function moddable(guild: Guild, targetId: string, modId: string) {
	let targetUser: GuildMember
	let modUser: GuildMember
	try {
		targetUser = await guild.members.fetch(targetId)
		modUser = await guild.members.fetch(modId)
	} catch {
		return 1
	}
	if (targetId == modId) return 2
	if (!targetUser.manageable) return 3
	const modUserRolePosition = modUser.roles.highest.position
	const targetUserPosition = targetUser.roles.highest.position
	if (modUserRolePosition <= targetUserPosition) return 4
	return 0
}
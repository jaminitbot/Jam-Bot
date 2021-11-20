import { Collection, Db, MongoClient } from 'mongodb'
import NodeCache = require('node-cache')
import { getLogger, stopBot } from './util'
import { Logger } from 'winston'

/**
 * Connects to the database
 * @param logger Winston Logger
 * @returns exports of Database object
 */
let ThisRawClient: MongoClient
let thisDb: Db
let thisDbCache: NodeCache
let thisLogger: Logger
export async function connect(logger: Logger) {
	thisLogger = getLogger()
	const databaseUrl = process.env.mongoUrl
	const databaseClient = new MongoClient(databaseUrl)
	try {
		await databaseClient.connect()
	} catch (e) {
		logger.error(e)
		await stopBot(null, null, 0)
	}
	ThisRawClient = databaseClient
	const db = databaseClient.db(process.env.databaseName)
	thisDb = db
	thisDbCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })
	return {
		setKey: setKey,
		getKey: getKey,
		returnRawClient: returnRawClient,
	}
}
interface SetKeyOptions {
	name: string
	group?: string | undefined
	value: unknown
}
/**
 * Sets a specified key for the guild
 * @param guildIdInput The guild identifier
 * @param key The database key to update in the database
 * @param value The value of the key to set
 * @returns Boolean
 */
export async function setKey(
	guildId: string,
	key: string | SetKeyOptions,
	value?: unknown
): Promise<void> {
	let group: string | undefined
	if (typeof key == 'object') {
		const tempObject: SetKeyOptions = key
		key = tempObject.name
		value = tempObject.value
		group = tempObject.group
	} else if (!value) {
		throw ('Value not specified')
	}
	const setObject: Record<string, unknown> = {}
	if (group) {
		setObject[group + '.' + key] = value
	} else {
		setObject[key] = value
	}
	// setObject['guildId'] = guildId
	const db: Collection = thisDb.collection('guilds')
	if (group) {
		await db.updateOne({ guildId: guildId }, { $set: setObject }, { upsert: true })
	} else {
		await db.updateOne({ guildId: guildId }, { $set: setObject }, { upsert: true })
	}
	const currentCache: Record<string, unknown> = thisDbCache.get(guildId) ?? {}
	if (group) {
		if (!currentCache[group]) currentCache[group] = {}
		// @ts-expect-error
		currentCache[group][key] = value
	} else {
		currentCache[key] = value
	}
	thisDbCache.set(guildId, currentCache)
}

interface GetKeyOptions {
	name: string
	group?: string | undefined
	bypassCache?: boolean | undefined
}
/**
 * Gets a particular key for the guild
 * @param guildIdInput The guild identifier
 * @param key The key or GetKeyOptions
 * @returns String
 */
export async function getKey(
	guildId: string | number,
	key: string | GetKeyOptions
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
	let group: string | null
	let bypassCache: boolean | undefined = false
	if (typeof key == 'object') { // Using getkey options
		const tempObject: GetKeyOptions = key
		key = tempObject.name
		group = tempObject.group
		bypassCache = tempObject.bypassCache ?? false
	}
	thisLogger.verbose(`Getting ${key} from group ${group ?? 'none'}, bypass cache is set to ${bypassCache}`)
	const currentCache: Record<string, unknown> = thisDbCache.get(guildId) ?? {}
	if (!bypassCache) {
		if (currentCache) {
			// @ts-expect-error
			if (group && currentCache[group] && currentCache[group][key]) {
				thisLogger.debug(`Got ${key} from CACHE`)
				// @ts-expect-error
				return currentCache[group][key]
			} else if (currentCache[key]) {
				thisLogger.debug(`Got ${key} from CACHE`)
				return currentCache[key]
			}
		}
	}
	const projection: Record<string, number> = {}
	projection[group ?? key] = 1
	const guildDbObject = await thisDb.collection('guilds').findOne(
		// Find guild in mongo db
		{ guildId: guildId },
		{ projection: projection }
	)
	if (!guildDbObject) {
		thisLogger.debug('Guild object was null, returning undefined')
		return undefined // If no guild object is found, return nothing
	}
	let returnValue: unknown
	if (group && guildDbObject[group]) {
		thisLogger.debug(`Got ${key} from DATABASE`)
		returnValue = guildDbObject[group][key]
		if (!currentCache[group]) currentCache[group] = {}
		// @ts-expect-error
		currentCache[group][key] = returnValue
	} else if (guildDbObject[key]) {
		thisLogger.debug(`Got ${key} from DATABASE`)
		returnValue = guildDbObject[key]
		currentCache[key] = returnValue
	} else {
		thisLogger.debug(`Got ${key} from DATABASE value was NULL`)
		returnValue = null
	}
	if (returnValue) {
		thisDbCache.set(guildId, currentCache)
	}
	return returnValue
}

/**
 *
 * @returns MongoClient
 */
export function returnRawClient(): MongoClient {
	return ThisRawClient
}

interface PurgeCacheOptions {
	group?: string | undefined
	name?: string | undefined
}
/**
 * Purges the database cache
 * @param guildId Guild ID
 * @param options Purge Cache Options
 * @returns Status Code
 */
export async function purgeCache(guildId: string, options?: PurgeCacheOptions) {
	let currentCache: Record<string, unknown> = thisDbCache.get(guildId)
	if (!currentCache) return 1
	const name = options.name
	const group = options.group
	try {
		if (group && name) {
			// @ts-expect-error
			delete currentCache[group][name]
		} else if (group && !name) {
			delete currentCache[group]
		} else if (!group && name) {
			delete currentCache[name]
		} else {
			currentCache = undefined
		}
	} catch {
		return 2
	}
	thisDbCache.set(guildId, currentCache)
	return 0
}

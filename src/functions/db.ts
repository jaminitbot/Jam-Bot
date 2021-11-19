import { Collection, MongoClient } from 'mongodb'
import NodeCache = require('node-cache')
import { stopBot } from './util'
import { Logger } from 'winston'

/**
 * Connects to the database
 * @param logger Winston Logger
 * @returns exports of Database object
 */
export async function connect(logger: Logger) {
	this.logger = logger
	const databaseUrl = process.env.mongoUrl
	const databaseClient = new MongoClient(databaseUrl)
	try {
		await databaseClient.connect()
	} catch (e) {
		logger.error(e)
		await stopBot(null, null, 0)
	}
	this.rawClient = databaseClient
	const db = databaseClient.db(process.env.databaseName)
	this.db = db
	this.dbCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })
	return {
		setKey: this.setKey,
		getKey: this.getKey,
		returnRawClient: this.returnRawClient,
	}
}

/**
 * Sets a specified key for the guild
 * @param guildIdInput The guild identifier
 * @param key The database key to update in the database
 * @param value The value of the key to set
 * @returns Boolean
 */
export async function setKey(
	guildIdInput: string,
	key: string,
	value: unknown
): Promise<boolean> {
	const db: Collection = this.db.collection('guilds')
	this.logger.debug(`DB: Updating ${key} to ${value}`)
	let guildDbObject = await db.findOne({ guildId: guildIdInput }) // Find the guild in db
	// @ts-expect-error
	if (!guildDbObject) guildDbObject = {}
	guildDbObject[key] = value // Set the key to the new value
	db.replaceOne({ guildId: guildIdInput }, guildDbObject, { upsert: true }) // Save to DB
	await this.dbCache.set(guildIdInput, guildDbObject) // Set in cache as well
	return true
}

/**
 * Gets a particular key for the guild
 * @param guildIdInput The guild identifier
 * @param key The key to get from the database
 * @returns String
 */

export async function getKey(
	guildIdInput: string | number,
	key: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
	const db = this.db.collection('guilds')
	const cacheValue = await this.dbCache.get(guildIdInput) // Check if guild is already in cache
	if (cacheValue && cacheValue[key]) {
		this.logger.debug(
			`DB: Got ${key} from CACHE with value: ${cacheValue[key]}`
		)
		return cacheValue[key] // If found in cache, return it
	}
	const projection = {}
	projection[key] = 1
	const guildDbObject = await db.findOne(
		// Find guild in mongo db
		{ guildId: guildIdInput },
		{ projection: projection }
	)
	if (!guildDbObject) return null // If no guild object is found, return nothing
	if (!guildDbObject[key]) {
		return null // Key doesn't exist
	}
	const currentCache = this.dbCache.get(guildIdInput) ?? {}
	currentCache[key] = guildDbObject[key]
	this.dbCache.set(guildIdInput, currentCache) // Put the key into the cache
	this.logger.debug(
		`DB: Got ${key} from DB with value: ${guildDbObject[key]}`
	)
	return guildDbObject[key] // Return the value from db
}

/**
 *
 * @returns MongoClient
 */
export function returnRawClient(): MongoClient {
	return this.rawClient
}

export async function getNestedSetting(
	guildId: string,
	nestedGroupName: string,
	key: string
) {
	const nestedGroupRaw = await getKey(guildId, nestedGroupName)
	if (!nestedGroupRaw) return null
	return nestedGroupRaw[key]
}

export async function setNestedSetting(
	guildId: string,
	nestedGroupName: string,
	key: string,
	value: unknown
) {
	let nestedGroupRaw = await getKey(guildId, nestedGroupName)
	if (!nestedGroupRaw) {
		nestedGroupRaw = {}
	}
	// eslint-disable-next-line prefer-const
	nestedGroupRaw[key] = value
	await setKey(guildId, nestedGroupName, nestedGroupRaw)
}
/**
 * 
 * @param guildId Guild ID
 * @param group (optional) group namw
 * @param key Key
 * @returns Promise<void>
 */
export async function purgeCache(guildId: string, group: string | null, key: string): Promise<void> {
	const cacheValue = await this.dbCache.get(guildId)
	if (!cacheValue) return
	if (group) {
		delete cacheValue[group][key]
	} else {
		delete cacheValue[key]
	}
	await this.dbCache.set(guildId, cacheValue)
}
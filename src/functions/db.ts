/**
 * 
 * @param logger Winston Logger
 * @returns Custom DB object
 */
export function connect(logger) {
	return new Promise((resolve, reject) => {
		let MongoClient
		let NodeCache
		try {
			MongoClient = require('mongodb').MongoClient
			NodeCache = require('node-cache')
		} catch (err) {
			logger.error('Error requiring mongodb or node-cache')
			logger.error(err)
			return null
		}
		const databaseUrl = process.env.MONGO_URL
		const mongoClient = MongoClient.connect(databaseUrl, (error, client) => {
			const db = client.db(process.env.DBNAME)
			this.db = db.collection('guilds')
			this.dbCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })
		})
		this.rawDb = mongoClient
		resolve(require('./db'))
	})
}

/**
 * @param guildIdInput The guild identifier
 * @param key The database key to update in the database
 * @param value The value of the key to set
 * @returns Boolean
*/
export async function setKey(guildIdInput: string, key: string, value: string) {
	let db = this.db
	if (process.env.NODE_ENV !== 'production')
		console.log(`Updating ${key} to ${value}`)
	let tempValue = await db.findOne({ guildId: guildIdInput }) // Find the guild in db
	if (!tempValue) { // If it doesn't exist, make a blank object
		tempValue = {}
	} else {
		tempValue = tempValue.value // Keys and values are stored in the value object
	}
	tempValue[key] = value // Set the key to the new value
	let dbObject = { guildId: guildIdInput, value: tempValue } // Make the mongo object
	db.replaceOne({ guildId: guildIdInput }, dbObject, { upsert: true }) // Save to DB
	await this.dbCache.set(guildIdInput, tempValue) // Set in cache as well
	return true
}
/**
 * @param guildIdInput The guild identifier
 * @param key The key to get from the database
 * @returns String
*/
export async function getKey(guildIdInput: string, key: string) {
	let db = this.db
	let cacheValue = await this.dbCache.get(guildIdInput) // Check if guild is already in cache
	if (cacheValue && cacheValue[key]) {
		if (process.env.NODE_ENV !== 'production')
			console.log(
				`Got ${key} from CACHE with value: ${cacheValue[key]}`
			)
		return cacheValue[key] // If found in cache, return it
	}
	let tempValue = await db.findOne( // Find guild in mongo db
		{ guildId: guildIdInput },
		{ projection: { _id: 0 } }
	)
	if (!tempValue) return null // If no guild object is found, return nothing
	tempValue = tempValue.value
	if (!tempValue[key]) {
		return null // Key doesn't exist
	}
	this.dbCache.set(guildIdInput, tempValue) // Put the key into the cache
	if (process.env.NODE_ENV !== 'production')
		console.log(`Got ${key} from DB with value: ${tempValue[key]}`)
	return tempValue[key] // Return the value from db
}
/**
 * 
 * @returns Mongo collection
 */
export function returnRawDb() {
	return this.rawDb
}
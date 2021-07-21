import {MongoClient} from "mongodb"
import NodeCache = require('node-cache');
import {stopBot} from './util'
import {Logger} from "winston";
/**
 *
 * @param logger Winston Logger
 * @returns exports of Database object
 */
export async function connect(logger:Logger) {
    this.logger = logger
    const databaseUrl = process.env.mongoUrl
    console.log('Attempting to login to mongo with creds: ' + databaseUrl)
    const databaseClient = new MongoClient(databaseUrl, {useUnifiedTopology: true})
    try{
        await databaseClient.connect()
    } catch(e) {
        logger.error(e)
        await stopBot(null, null, 0)
    }
    this.rawClient = databaseClient
    const db = databaseClient.db(process.env.databaseName)
    this.db = db.collection('guilds')
    this.dbCache = new NodeCache({stdTTL: 300, checkperiod: 60})
    return require('./db')
}

/**
 * @param guildIdInput The guild identifier
 * @param key The database key to update in the database
 * @param value The value of the key to set
 * @returns Boolean
 */
export async function setKey(guildIdInput: string, key: string, value: unknown): Promise<boolean> {
    const db = this.db
    this.logger.debug(`Updating ${key} to ${value}`)
    let guildDbObject = await db.findOne({guildId: guildIdInput}) // Find the guild in db
    guildDbObject = guildDbObject?.value ?? {}
    guildDbObject[key] = value // Set the key to the new value
    const dbObject = {guildId: guildIdInput, value: guildDbObject} // Make the mongo object
    db.replaceOne({guildId: guildIdInput}, dbObject, {upsert: true}) // Save to DB
    await this.dbCache.set(guildIdInput, guildDbObject) // Set in cache as well
    return true
}

/**
 * @param guildIdInput The guild identifier
 * @param key The key to get from the database
 * @returns String
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getKey(guildIdInput: string, key: string): Promise<any> {
    const db = this.db
    const cacheValue = await this.dbCache.get(guildIdInput) // Check if guild is already in cache
    if (cacheValue && cacheValue[key]) {
        this.logger.debug(`Got ${key} from CACHE with value: ${cacheValue[key]}`)
        return cacheValue[key] // If found in cache, return it
    }
    let guildDbObject = await db.findOne( // Find guild in mongo db
        {guildId: guildIdInput},
        {projection: {_id: 0}}
    )
    if (!guildDbObject) return null // If no guild object is found, return nothing
    guildDbObject = guildDbObject.value
    if (!guildDbObject[key]) {
        return null // Key doesn't exist
    }
    this.dbCache.set(guildIdInput, guildDbObject) // Put the key into the cache
    this.logger.debug(`Got ${key} from DB with value: ${guildDbObject[key]}`)
    return guildDbObject[key] // Return the value from db
}

/**
 *
 * @returns MongoClient
 */
export function returnRawClient(): MongoClient {
    return this.rawClient
}
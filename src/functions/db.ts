module.exports = {
    connect(logger) {
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
            MongoClient.connect(databaseUrl, (error, client) => {
                const db = client.db(process.env.DBNAME)
                try {
                    db.createCollection('guilds')
                } catch {
                    {
                    }
                }
                this.db = db.collection('guilds')
                this.dbCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })
            })
            resolve(module.exports)
        })
    },
    async updateKey(guildIdInput: number, key: string, value: object) {
        let db = this.db
        if (process.env.NODE_ENV !== 'production')
            console.log(`Updating ${key} to ${value}`)
        let tempValue = await db.findOne({ guildId: guildIdInput })
        if (!tempValue) {
            tempValue = {}
        } else {
            tempValue = tempValue.value
        }
        tempValue[key] = value
        let dbObject = { guildId: guildIdInput, value: tempValue }
        db.replaceOne({ guildId: guildIdInput }, dbObject, { upsert: true })
        // await this.db.set(guild.id, tempValue)
        await this.dbCache.set(guildIdInput, tempValue)
        return true
    },
    async get(guildIdInput: number, key: string) {
        let db = this.db
        let cacheValue = await this.dbCache.get(guildIdInput)
        if (cacheValue && cacheValue[key]) {
            if (process.env.NODE_ENV !== 'production')
                console.log(
                    `Got ${key} from CACHE with value: ${cacheValue[key]}`
                )
            return cacheValue[key] // If found in cache, return it
        }
        let tempValue = await db.findOne(
            { guildId: guildIdInput },
            { projection: { _id: 0 } }
        )
        if (!tempValue) return null
        tempValue = tempValue.value
        if (!tempValue[key]) {
            return null // Key doesn't exist
        }
        this.dbCache.set(guildIdInput, tempValue) // Put the key into the cache
        if (process.env.NODE_ENV !== 'production')
            console.log(`Got ${key} from DB with value: ${tempValue[key]}`)
        return tempValue[key] // Return the value from db
    },
}

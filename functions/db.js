module.exports = {
	connect(config, logger) {
		let Keyv
		try {
			Keyv = require('keyv');
		} catch (err) {
			logger.error('Error requiring keyv.')
			logger.error(err)
			return null
		}
		const db = new Keyv(process.env.DATABASE_URL || process.env.MONGO_URL)
		return db
	},
	async updateKey(db, guild, key, value) {
		let tempValue
		tempValue = await db.get(guild)
		console.log(tempValue)
		if (!tempValue) tempValue = {}
		tempValue[key] = value
		console.log(tempValue)
		await db.set(guild, tempValue)
		return true
	},
	async get(db, guild, key) {
			let tempValue = await db.get(guild)
			if (!tempValue) tempValue = {}
			return tempValue[key]
	}
}

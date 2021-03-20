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
		const db = new Keyv(process.env.MONGO_URL || process.env.DATABASE_URL)
		return db
	},
	async updateKey(db, guild, key, value) {
		let tempValue
		tempValue = await db.get(guild.id)
		if (!tempValue) tempValue = {}
		tempValue[key] = value
		await db.set(guild.id, tempValue)
		return true
	},
	async get(db, guild, key) {
			let tempValue = await db.get(guild.id)
			if (!tempValue) tempValue = {}
			console.log(`${key}: ${tempValue[key]}`)
			return tempValue[key]
	}
}

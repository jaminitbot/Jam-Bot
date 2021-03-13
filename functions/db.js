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
		const db = new Keyv(config.settings.databaseLocation)
		return db
	},
	async updateKey(db, guild, key, value) {
		let tempValue = await db.get(guild)
		tempValue[key] = value
		await db.set(guild, tempValue)
		return true
	},
	async get(db, guild, key) {
			let tempValue = await db.get(guild)
			return tempValue[key]
	}
}

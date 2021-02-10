module.exports = {
	connect(config, logger) {
		try {
			sqlite3 = require('sqlite3').verbose()
		} catch (err) {
			logger.error('Error requiring sqlite.')
			logger.error(err)
			return null
		}
		// Help me
		const db = new sqlite3.cached.Database(config.settings.databaseLocation, (err) => {
			if (err) return console.error(err.message)
			logger.info('Connected to sqlite database')
		})
		return db
	},
	updateKey(db, guild, key, value) {
		db.run('UPDATE "' + guild + '" SET \'value\' = \'' + value + '\' WHERE key=\'' + key + '\'', (err) => {
			if (err) return console.error(err.message)
			db.get('SELECT "value" FROM "' + guild + '" WHERE key="' + key + '"', (err, row) => {
				if (err) return console.error(err.message)
				if (!row) {
					db.run('INSERT INTO "' + guild + '" (key, value) VALUES (\'' + key + '\', \'' + value + '\')', (err) => {
						if (err) return console.error(err.message)
					})
				}
			})
			if (err) return console.error(err.message)
		})
	}
}

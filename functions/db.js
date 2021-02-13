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
			if (err) return logger.error(err.message)
			logger.info('Connected to sqlite database')
		})
		return db
	},
	updateKey(db, guild, key, value) {
		console.log(`Updating ${key} with value: ${value}`)
		db.run('UPDATE "' + guild + '" SET \'value\' = \'' + value + '\' WHERE key=\'' + key + '\'', (err) => {
			if (err) return console.error('Error updating: ' + err.message)
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
	},
	get(db, query, params) {
		return new Promise(function(resolve, reject) {
			db.get(query, params, function(err, row)  {
				if(err) reject("Read error: " + err.message)
				else {
					resolve(row)
				}
			})
		}) 
	}
}

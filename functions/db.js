module.exports = {
	connect(config) {
		try {
			sqlite3 = require('sqlite3').verbose()
		} catch (err) {
			console.log('Error requiring sqlite, perhaps you haven\'t installed it')
			console.error(err)
			return null
		}
		// Help me
		const db = new sqlite3.cached.Database(config.settings.databaseLocation, (err) => {
			if (err) return console.error(err.message)
			console.log('Connected to the SQlite database')
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

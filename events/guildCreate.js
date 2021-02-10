module.exports = {
	register(guild, db, config) {
		db.run('CREATE TABLE "' + guild.id + '" (key varchar(255), value varchar(255))', (err) => { // Create database table
			if (err) {
				return logger.error(err.message)
			}
		})
	}
}

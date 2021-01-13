module.exports = {
  execute (db, guild, key, value) {
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

module.exports = {
  register(guild, db, config) {
    db.run(
      'CREATE TABLE "' + guild.id + '" (key varchar(255), value varchar(255))',
      (err) => {
        // Create database table
        if (err) {
          return console.error(err.message);
        }
        db.run(
          'INSERT INTO "' +
            guild.id +
            "\" (key, value) VALUES ('prefix', '" +
            config.defaults.prefix +
            "'')",
          (err) => {
            // Input default prefix
            if (err) {
              return console.error(err.message);
            }
          }
        );
        db.run(
          'INSERT INTO "' +
            guild.id +
            "\" (key, value) VALUES ('modLogChannel', '')",
          (err) => {
            // Modlog channel off
            if (err) {
              return console.error(err.message);
            }
          }
        );
      }
    );
  },
};

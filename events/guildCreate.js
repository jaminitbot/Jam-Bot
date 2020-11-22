module.exports = {
    register(guild, db, config){
        console.log("Joined a new guild: " + guild.name);
        db.run('CREATE TABLE "' + guild.id + '" (key varchar(255), value varchar(255))', (err) => {
        if (err) {
            return console.error(err.message);
        }
        db.run('INSERT INTO "' + guild.id + '" (key, value) VALUES (\'prefix\', \''+ config.defaults.prefix + '\'\')', (err) => {
            if (err) {
                return console.error(err.message);
            }   
        })
        db.run('INSERT INTO "' + guild.id + '" (key, value) VALUES (\'modLogChannel\', \'\')', (err) => {
            if (err) {
                return console.error(err.message);
            }   
        })
        })
    }
}
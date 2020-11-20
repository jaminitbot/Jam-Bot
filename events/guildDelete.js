module.exports = {
    register(guild, db){
        console.log("Left a guild: " + guild.name);
        db.run('DROP TABLE "' + guild.id + '"', (err) => {
        if (err) {
            return console.error(err.message);
        }   
    })
    }
}
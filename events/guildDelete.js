module.exports = {
    register(guild, db){
        db.run('DROP TABLE "' + guild.id + '"', (err) => {
        if (err) {
            return console.error(err.message);
        }   
    })
    }
}
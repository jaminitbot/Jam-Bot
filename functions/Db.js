module.exports = {
    connect(config){
        const DatabaseType = config.settings.database.databaseType
        if (DatabaseType == 'sqlite'){
            try {
                sqlite3 = require('sqlite3').verbose()
            } catch (err){
                console.log('Error requiring sqlite, perhaps you haven\'t installed it')
                console.error(err)
                return null
            }
            const db = new sqlite3.cached.Database(config.settings.database.databaseLocation, (err) => {
                if (err) return console.error(err.message)
                console.log('Connected to the SQlite database')
            })
            return db            
        } if (DatabaseType == 'mysql') {
            try {
                mysql = require('mysql')
            } catch (err){
                console.log('Error requiring mysql, perhaps you haven\'t installed it')
                console.error(err)
                return null
            }
            var connection = mysql.createConnection({
                host     : config.settings.database.host,
                user     : config.settings.database.user,
                password : config.settings.database.password,
                database : config.settings.database.database
              });
              
              connection.connect();
              return connection
        }
        else {
            console.error('Database type not found')
            return null
        }
    }
}
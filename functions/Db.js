// DB Driver to accomodate for multiple types of databases
// TODO: #8 Actually implement support for multiple databases as sqlite only works as the commands (for the driver) are different for mysql
module.exports = {
    connect(config){
        const DatabaseType = config.settings.database.databaseType
        const database = config.settings.database
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
        } else if (DatabaseType == 'mysql') {
            try {
                mysql = require('mysql')
            } catch (err){
                console.log('Error requiring mysql, perhaps you haven\'t installed it')
                console.error(err)
                return null
            }
            var connection = mysql.createConnection({
                host     : database.host,
                user     : database.user,
                password : database.password,
                database : database.database
              })
              
              connection.connect()
              return connection
        }
        else {
            console.error('Database type not found')
            return null
        }
    }
}
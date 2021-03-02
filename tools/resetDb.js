const config = require('../config.json')
const dbScript = require('../functions/db')
const db = dbScript.connect(config)
dbScript.updateKey(db, '779060204528074783', 'LiveTime', '0')
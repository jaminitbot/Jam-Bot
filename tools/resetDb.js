const config = require('../config.json')
const dbScript = require('../functions/db')
const { createLogger, format, transports } = require('winston');
const winston = require('winston')
const { combine, timestamp, label, printf } = format;
const loggingFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
  });
const logger = winston.createLogger({
	level: 'info',
	format: combine(
		timestamp(),
		loggingFormat
	  ),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
	],
})
const db = dbScript.connect(config, logger)
dbScript.updateKey(db, '779060204528074783', 'LiveTime', 'NONE')
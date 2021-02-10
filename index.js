// Mr imports
const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client()
const config = require('./config.json')
const schedule = require('node-schedule')
const winston = require('winston')

// Event imports
const guildCreate = require('./events/guildCreate')
const guildDelete = require('./events/guildDelete')
const message = require('./events/message')
const messageDelete = require('./events/messageDelete')
const guildMemberAdd = require('./events/guildMemberAdd')

// Misc Scripts
const dbScript = require('./functions/db')
const twitch = require('./cron/twitch')

// Logging
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
	  //
	  // - Write all logs with level `error` and below to `error.log`
	  // - Write all logs with level `info` and below to `combined.log`
	  //
	  new winston.transports.File({ filename: 'error.log', level: 'error' }),
	  new winston.transports.File({ filename: 'combined.log' }),
	],
  })

// Registers all the commands in the commands folder
// https://discordjs.guide/command-handling/dynamic-commands.html#how-it-works
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

// Database connections
const db = dbScript.connect(config, logger)

if (!db) {
	process.exit(1)
}

// Events
client.on('guildCreate', guild => { guildCreate.register(guild, db, config) })
client.on('guildDelete', guild => { guildDelete.register(guild, db) })
client.on('message', msg => { message.register(client, msg, db, config, logger) })
client.on('messageDelete', msg => { messageDelete.register(client, msg, db) })
client.on('guildMemberAdd', member => { guildMemberAdd.register(member) })
client.on('error', error => { logger.error(error) })
client.on('invalidated', function() { process.emit('SIGINT') })
client.on('guildUnavailable',  guild => { logger.error(`Guild ${guild.id} has gone unaviliable.`) })
client.on('warn',  info => { logger.warn(info) })
client.on('rateLimit',  rateLimitInfo => { logger.error(`Rate limit hit. Triggered by ${rateLimitInfo.path}, timeout for ${rateLimitInfo.timeout}. Only ${rateLimitInfo.limit} can be made`) })

// SIGINT STUFF
if (process.platform === 'win32') {
	const rl = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	})
	rl.on('SIGINT', function () {
		process.emit('SIGINT')
	})
}
process.on('SIGINT', function () {
	// Shutdown stuff nicely
	db.close()
	logger.info('Recieved SIGINT, gracefully shutting down.')
	client.destroy()
	process.exit()
})

// Intialisation
client.on('ready', () => {
	console.log('Logged in')
	logger.info('Logged in at ' + Date.now())
	client.user.setActivity('?help', { type: 'WATCHING' })
	if (config.settings.twitchApiClientId && config.settings.twitchApiSecret) { // Only if api tokens are present
		schedule.scheduleJob('*/2 * * * * *', function () { // Twitch notifications
			twitch.execute(client, db, config)
		})
	}
})

client.login(config.settings.token)

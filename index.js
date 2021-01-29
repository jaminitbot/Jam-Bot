// Mr imports
const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client()
const config = require('./config.json')
const schedule = require('node-schedule')

// Event imports
const guildCreate = require('./events/guildCreate')
const guildDelete = require('./events/guildDelete')
const message = require('./events/message')
const messageDelete = require('./events/messageDelete')
const guildMemberAdd = require('./events/guildMemberAdd')

// Misc Scripts
const dbScript = require('./functions/db')
const twitch = require('./cron/twitch')

// Registers all the commands in the commands folder
// https://discordjs.guide/command-handling/dynamic-commands.html#how-it-works
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

// Database connections
const db = dbScript.connect(config)

if (!db) {
	console.error('Error connecting to db')
	process.exit(1)
}
// Events
client.on('guildCreate', guild => { guildCreate.register(guild, db, config) })
client.on('guildDelete', guild => { guildDelete.register(guild, db) })
client.on('message', msg => { message.register(client, msg, db, config) })
client.on('messageDelete', msg => { messageDelete.register(client, msg, db) })
client.on('guildMemberAdd', member => { guildMemberAdd.register(member) })
client.on('error', error => { console.error(error) })
client.on('invalidated', function() { process.emit('SIGINT') })

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
	console.log('Closing gracefully...')
	client.destroy()
	process.exit()
})

// Intialisation
client.on('ready', () => {
	console.log('Logged in...')
	client.user.setActivity('?help', { type: 'WATCHING' })
	if (config.settings.twitchApiClientId && config.settings.twitchApiSecret) { // Only if api tokens are present
		schedule.scheduleJob('*/2 * * * * *', function () { // Twitch notifications
			twitch.execute(client, db, config)
		})
	}
})

client.login(config.settings.token)

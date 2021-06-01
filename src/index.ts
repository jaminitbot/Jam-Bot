process.chdir(__dirname)
// Mr imports
const Discord = require('discord.js')
import { Intents } from 'discord.js'
const fs = require('fs')
const client = new Discord.Client({ disableMentions: 'everyone', ws: { intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'] } })
const schedule = require('node-schedule')
const { createLogger, format, transports } = require('winston')
const winston = require('winston')
const { combine, timestamp, label, printf } = format
import { stopBot } from './functions/util'

// Event Imports
import guildCreate from './events/guildCreate'
import guildDelete from './events/guildDelete'
import messageEvent from './events/message'
import messageUpdate from './events/messageUpdate'
import messageDelete from './events/messageDelete'
import guildMemberAdd from './events/guildMemberAdd'

// Misc Scripts
import sendTwitchNotifs from './cron/twitch'
import { connect, returnRawClient } from './functions/db'

(async function () {
	if (process.env.NODE_ENV !== 'production') {
		const dotenv = require('dotenv').config()
	}

	// Logging
	const loggingFormat = printf(({ level, message, label, timestamp }) => {
		return `${timestamp} ${level}: ${message}`
	})
	const logger = createLogger({
		level: 'info',
		format: combine(timestamp(), loggingFormat),
		transports: [
			new winston.transports.Console(),
			new winston.transports.File({
				filename: 'error.log',
				level: 'error',
			}),
			new winston.transports.File({ filename: 'combined.log' }),
		],
	})

	// Registers all the commands in the commands folder
	// https://discordjs.guide/command-handling/dynamic-commands.html#how-it-works
	client.commands = new Discord.Collection()
	const commandFiles = fs
		.readdirSync('./commands')
		.filter((file) => file.endsWith('.js'))
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`)
		client.commands.set(command.name, command)
	}

	// Database connections
	const db = await connect(logger)
	if (!db) {
		logger.error('DB not found')
		process.exit(1)
	}

	// Events
	client.on('guildCreate', (guild) => {
		guildCreate(guild, logger)
	})
	client.on('guildDelete', (guild) => {
		guildDelete(guild)
	})
	client.on('message', (msg) => {
		messageEvent(client, msg, logger)
	})
	client.on('messageDelete', (msg) => {
		messageDelete(client, msg)
	})
	client.on('messageUpdate', (oldMessage, newMessage) => {
		messageUpdate(oldMessage, newMessage)
	})
	client.on('guildMemberAdd', (member) => {
		guildMemberAdd(member)
	})
	client.on('error', (error) => {
		logger.error(error)
	})
	client.on('invalidated', function () {
		// @ts-expect-error
		process.emit('SIGINT')
	})
	client.on('guildUnavailable', (guild) => {
		logger.error(`Guild ${guild.id} has gone unaviliable.`)
	})
	client.on('warn', (info) => {
		logger.warn(info)
	})
	client.on('rateLimit', (rateLimitInfo) => {
		logger.error(
			`Rate limit hit. Triggered by ${rateLimitInfo.path}, timeout for ${rateLimitInfo.timeout}. Only ${rateLimitInfo.limit} can be made`
		)
	})

	// SIGINT STUFF
	if (process.platform === 'win32') {
		const rl = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout,
		})
		rl.on('SIGINT', function () {
			// @ts-ignore
			process.emit('SIGINT')
		})
	}
	process.on('SIGINT', function () {
		// Shutdown stuff nicely
		logger.info('Recieved SIGINT, gracefully shutting down.')
		stopBot(client, returnRawClient())
	})

	// Intialisation
	client.on('ready', () => {
		logger.info('Logged in at ' + Date.now())
		client.user.setActivity('?help', { type: 'WATCHING' })
		if (process.env.twitchApiClientId && process.env.twitchApiSecret) {
			// Only if api tokens are present
			schedule.scheduleJob('*/5 * * * * *', function () {
				// Twitch notifications
				sendTwitchNotifs(client, logger)
			})
		}
	})
	client.login(process.env.token)
}())

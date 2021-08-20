process.chdir(__dirname)
// Mr imports
if (!process.env.token) {
	require('dotenv').config();
}

import { Client, ClientOptions, Intents } from 'discord.js'
import { createLogger, transports, format } from "winston";
import { BotClient } from './customDefinitions'
import { scheduleJob } from 'node-schedule'
import { registerCommands, registerEvents, registerSlashCommands } from './functions/registerCommands'
import { saveStatsToDB, connectToSatsCollection } from './functions/stats'
// Misc Scripts
import sendTwitchNotifications from './cron/twitch'
import { connect, returnRawClient } from './functions/db'
import { stopBot } from './functions/util'
// eslint-disable-next-line no-unexpected-multiline
(async function () {
	const clientOptions: ClientOptions = {
		allowedMentions: { parse: ['roles', 'everyone'] },
		intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
		presence: { status: 'online', activities: [{ name: process.env.defaultPrefix + 'help', type: 'WATCHING' }] },
		partials: ['MESSAGE']
	}
	// @ts-expect-error
	const client: BotClient = new Client(clientOptions)
	// Logging
	client.logger = createLogger({
		level: 'info',
		transports: [
			new transports.File({
				filename: 'error.log',
				level: 'warn',
				format: format.combine(
					format.timestamp(),
					format.json()
				),
			}),
			new transports.File({
				filename: 'combined.log',
				level: 'info',
				format: format.combine(
					format.timestamp(),
					format.json()
				),
			}),
		],
	})
	if (String(process.env.showDebugMessages).toUpperCase() == 'TRUE') {
		client.logger.add(new transports.Console({
			level: 'debug',
			format: format.combine(format.colorize(), format.simple()),
		}));
		client.logger.info('Logger is in DEBUG mode')
	} else if (process.env.NODE_ENV !== 'production') {
		client.logger.add(new transports.Console({
			level: 'verbose',
			format: format.combine(format.colorize(), format.simple()),
		}));
		client.logger.info('Logger is in VERBOSE mode')
	}
	// Registers all the commands in the commands folder
	// https://discordjs.guide/command-handling/dynamic-commands.html#how-it-works
	client.logger.verbose('Registering commands...')
	registerCommands(client)
	client.logger.verbose('Registering events...')
	registerEvents(client)
	// Database connections
	client.logger.verbose('Attempting to connect to database...')
	const db = await connect(client.logger)
	if (!db) {
		client.logger.error('DB not found')
		await stopBot(client, null, 1)
	} else {
		client.logger.verbose("Successfully connected to database")
	}
	connectToSatsCollection(returnRawClient())
	// Events
	client.on('guildCreate', guild => {
		client.events.get('guildCreate').register(guild)
	})
	client.on('guildDelete', guild => {
		client.events.get('guildDelete').register(guild)
	})
	client.on('messageCreate', message => {
		client.events.get('messageCreate').register(client, message)
	})
	client.on('messageDelete', message => {
		client.events.get('messageDelete').register(client, message)
	})
	client.on('messageUpdate', (oldMessage, newMessage) => {
		client.events.get('messageUpdate').register(client, oldMessage, newMessage)
	})
	client.on('error', error => {
		client.logger.error('Error logged: ' + error)
	})
	client.on('invalidated', function () {
		client.logger.error('Client invalidated, quitting...')
		stopBot(client, returnRawClient(), 1)
	})
	client.on('guildUnavailable', (guild) => {
		client.logger.warn(`Guild ${guild.id} has gone offline.`)
	})
	client.on('warn', info => {
		client.logger.warn(info)
	})
	client.on('rateLimit', rateLimitInfo => {
		client.logger.warn(
			`Rate limit hit. Triggered by ${rateLimitInfo.path}, timeout for ${rateLimitInfo.timeout}. Only ${rateLimitInfo.limit} can be made`
		)
	})
	client.on('interactionCreate', interaction => {
		client.events.get('interactionCreate').register(client, interaction)
	})
	client.on('guildMemberUpdate', (oldMember, newMember) => {
		client.events.get('guildMemberUpdate').register(oldMember, newMember)
	})
	client.on('guildMemberAdd', member => {
		client.events.get('guildMemberAdd').register(member)
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
		client.logger.debug('SIGINT received, stopping bot')
		stopBot(client, returnRawClient())
	})

	if (process.env.NODE_ENV == 'production') {
		process.on('uncaughtException', (error) => {
			client.logger.error('Unhandled exception caught: ' + error)
		});
	}
	// Initialisation
	client.on('ready', async () => {
		client.logger.info('Client is READY')
		await registerSlashCommands(client)
		if (process.env.twitchApiClientId && process.env.twitchApiSecret) {
			// Only if api tokens are present
			scheduleJob('*/5 * * * * *', function () {
				// Twitch notifications
				sendTwitchNotifications(client)
			})
			scheduleJob('* * * * *', function () {
				saveStatsToDB()
			})
		}
	})
	await client.login(process.env.token)
}())

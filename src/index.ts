process.chdir(__dirname)
if (process.env.NODE_ENV != 'production') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config({path: '../.env'})
}

// Mr imports
import { Client, ClientOptions, Intents, MessageEmbed, WebhookClient, } from 'discord.js'
import { createLogger, format, transports } from 'winston'
import { BotClient } from './customDefinitions'
import { scheduleJob } from 'node-schedule'
import { registerCommands, registerEvents, } from './functions/registerCommands'
// Misc Scripts
import sendTwitchNotifications from './cron/twitch'
import { connect } from './functions/db'
import { removeItemFromArray, saveLogger, stopBot } from './functions/util'
import { processTasks } from './functions/mod'
import { initTranslations } from './functions/locales'
import { incrementEventsCounter, initProm, saveClientPing } from './functions/metrics'

// eslint-disable-next-line no-unexpected-multiline
(async function () {
    // Logging
    const logger = createLogger({
        level: 'info',
        transports: [
            new transports.File({
                filename: 'error.log',
                level: 'warn',
                format: format.combine(format.timestamp(), format.json()),
            }),
            new transports.File({
                filename: 'combined.log',
                level: 'info',
                format: format.combine(format.timestamp(), format.json()),
            }),
        ],
    })
    if (String(process.env.showDebugMessages).toUpperCase() == 'TRUE') {
        logger.add(
            new transports.Console({
                level: 'debug',
                format: format.combine(format.colorize(), format.simple()),
            })
        )
        logger.info('Logger is in DEBUG mode')
    } else if (process.env.NODE_ENV !== 'production') {
        logger.add(
            new transports.Console({
                level: 'verbose',
                format: format.combine(format.colorize(), format.simple()),
            })
        )
        logger.info('Logger is in VERBOSE mode')
    }
    //#region Error reporting
    const loggerBuffer: Array<string> = []
    logger.on('data', async (data) => {
        try {
            if (
                String(data.message).includes('DiscordAPIError: Missing Access')
            )
                return
            if (
                (data.level == 'error' || data.level == 'warn') &&
                process.env.errorLogWebhookUrl
            ) {
                const loggerWebhookClient = new WebhookClient({
                    url: process.env.errorLogWebhookUrl,
                })
                if (loggerBuffer.includes(data.message)) return
                const embed = new MessageEmbed()
                embed.setTitle(`Logger`)
                embed.setTimestamp(Date.now())
                if (data.level == 'error') {
                    embed.setColor('#ff0000')
                } else {
                    embed.setColor('#ffbf00')
                }
                embed.addField(String(data.level).toUpperCase(), data.message)
                loggerBuffer.push(data.message)
                try {
                    loggerWebhookClient.send({
                        username: client.user.username,
                        avatarURL: client.user.avatarURL(),
                        embeds: [embed],
                    })
                    // eslint-disable-next-line no-empty
                } catch {
                }
                setTimeout(
                    () => removeItemFromArray(loggerBuffer, data.message),
                    20 * 1000
                )
            }
            // eslint-disable-next-line no-empty
        } catch {
        }
    })
    if (process.env.NODE_ENV == 'production') {
        process.on('uncaughtException', (error, source) => {
            logger.error(
                'Unhandled exception caught: ' + error + '\n' + source
            )
        })
    }
    logger.info('Bot is starting...')
    saveLogger(logger)
    //#endregion
    const clientOptions: ClientOptions = {
        allowedMentions: {parse: ['roles', 'users']},
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
        ],
        presence: {
            status: 'online',
            activities: [{name: '/help', type: 'WATCHING'}],
        },
        partials: ['MESSAGE', 'GUILD_MEMBER'],
    }
    // @ts-expect-error
    const client: BotClient = new Client(clientOptions)
    client.logger = logger
    logger.verbose('Registering translations...')
    initTranslations()
    // Registers all the commands in the commands folder
    // https://discordjs.guide/command-handling/dynamic-commands.html#how-it-works
    logger.verbose('Registering commands...')
    registerCommands(client)
    logger.verbose('Registering events...')
    registerEvents(client)
    // Database connections
    logger.verbose('Connecting to database...')
    const db = await connect()
    if (!db) {
        logger.error('DB not found')
        await stopBot(client, 1)
    }
    // Events
    client.on('guildCreate', (guild) => {
        client.events.get('guildCreate')?.register(client, guild)
        incrementEventsCounter('guild_create')
    })
    client.on('guildDelete', (guild) => {
        client.events.get('guildDelete')?.register(guild)
        incrementEventsCounter('guild_delete')
    })
    client.on('messageCreate', (message) => {
        client.events.get('messageCreate')?.register(client, message)
        incrementEventsCounter('message_create')
    })
    client.on('messageDelete', (message) => {
        client.events.get('messageDelete')?.register(client, message)
        incrementEventsCounter('message_delete')
    })
    client.on('messageUpdate', (oldMessage, newMessage) => {
        client.events.get('messageUpdate')?.register(client, oldMessage, newMessage)
        incrementEventsCounter('message_update')
    })
    client.on('error', (error) => {
        logger.error('Error logged: ' + error)
    })
    client.on('invalidated', function () {
        logger.error('Client invalidated, quitting...')
        stopBot(client, 1)
    })
    client.on('guildUnavailable', (guild) => {
        logger.warn(`Guild ${guild.id} has gone offline.`)
    })
    client.on('warn', (info) => {
        logger.warn(info)
    })
    client.on('interactionCreate', (interaction) => {
        client.events.get('interactionCreate')?.register(client, interaction)
        incrementEventsCounter('interaction_create')
    })
    client.on('guildMemberAdd', (member) => {
        client.events.get('guildMemberAdd')?.register(client, member)
        incrementEventsCounter('guild_member_add')
    })
    client.on('guildMemberRemove', (member) => {
        client.events.get('guildMemberRemove')?.register(client, member)
        incrementEventsCounter('guild_member_remove')
    })
    //#region SIGINT WINDOWS
    if (process.platform === 'win32') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        })
        rl.on('SIGINT', function () {
            // @ts-ignore
            process.emit('SIGINT')
        })
    }
    //#endregion
    process.on('SIGINT', function () {
        // Shutdown stuff nicely
        logger.debug('SIGINT received, stopping bot')
        stopBot(client)
    })
    logger.verbose('Starting prom client')
    initProm()
    // Initialisation
    client.on('ready', async () => {
        logger.info('Bot is READY')
        if (process.env.twitchApiClientId && process.env.twitchApiSecret) {
            // Only if api tokens are present
            scheduleJob('*/5 * * * * *', function () {
                // Twitch notifications
                sendTwitchNotifications(client)
            })
        }
        scheduleJob('*/30 * * * * *', function () {
            processTasks(client)
        })
        scheduleJob('*/5 * * * * *', function () {
            saveClientPing(client.ws.ping)
        })
    })
    await client.login(process.env.token)
})()

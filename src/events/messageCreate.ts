import { capitaliseSentence, checkPermissions, checkRateLimit, getRateLimitRemaining, returnInvalidPermissionMessage, setRateLimit, } from '../functions/util'
import { getGuildSetting } from '../functions/db'
import { BotClient } from '../customDefinitions'
import { Message, MessageEmbed } from 'discord.js'
import { getErrorMessage } from '../functions/messages'
import Sentry from '../functions/sentry'
import i18next from 'i18next'
import { incrementMessageCounter } from '../functions/metrics'
import { GLOBAL_RATELIMIT_DURATION } from '../consts'

const bannedIds = ['']
export const name = 'messageCreate'

// let mentionSlash = true
export async function register(client: BotClient, message: Message) {
    incrementMessageCounter(message.guild?.id ?? null)
    if (message.author.bot) return
    if (bannedIds.includes(message.author.id)) return
    const guildId = message.guild ? message.guild.id : 0
    const prefix =
        (await getGuildSetting(guildId, 'prefix')) || process.env.defaultPrefix
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandRequested = args.shift().toLowerCase()
    const command =
        client.commands.get(commandRequested) ||
        client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandRequested)
        )
    if (message.content.startsWith(prefix)) {
        if (!command) {
            client.logger.debug(
                `messageHandler: Command ${commandRequested ?? 'NULL'
                } doesn't exist, not continuing...`
            ) // Doesn't have specified command
            return
        }
        if (typeof command.execute != 'function') return
        client.logger.verbose(
            `messageHandler: Command ${commandRequested ?? 'NULL'
            } has been requested by ${message.author.tag}, executing command...`
        )
        if (
            message.channel.type == 'GUILD_PUBLIC_THREAD' ||
            message.channel.type == 'GUILD_PRIVATE_THREAD'
        ) {
            try {
                await message.channel.join()
            } catch {
                return
            }
        }
        if (message.channel.type == 'DM' && !command.allowInDm) {
            try {
                await message.channel.send(
                    i18next.t('events:interactionCreate.DISABLED_IN_DMS')
                )
                // eslint-disable-next-line no-empty
            } catch {
            }
            return
        }
        // if (typeof command.executeSlash == 'function' && !command.exposeSlash && mentionSlash) {
        //     const slashCommandMessage = await message.reply(`Hey! There's this posh new thing called slash commands, and that command can be used with it! Try doing \`/${command.name}\`! They're so much easier to use :) \n*Dismissing this message for 20 seconds*`)
        //     mentionSlash = false
        //     setTimeout(() => mentionSlash = true, 20 * 1000)
        //     setTimeout(() => slashCommandMessage.delete(), 5 * 1000)
        // }
        if (command.permissions) {
            if (!checkPermissions(message.member, [...command.permissions])) {
                // User doesn't have specified permissions to run command
                client.logger.debug(
                    `messageHandler: User ${message.author.tag
                    } doesn't have the required permissions to run command ${commandRequested ?? 'NULL'
                    }, returning invalid permission message`
                )
                if (command.permissions.includes('OWNER')) return
                try {
                    returnInvalidPermissionMessage(message)
                    // eslint-disable-next-line no-empty
                } catch {
                }
                return
            }
        }
        if (checkRateLimit(command.name, command.rateLimit, message.author.id)) {
            const commandRateLimit = command.rateLimit ?? GLOBAL_RATELIMIT_DURATION
            await message.reply({
                content: i18next.t('general:RATE_LIMIT_HIT', { time: commandRateLimit * 1000, timeLeft: getRateLimitRemaining(command.name, command.rateLimit, message.author.id) }),
            })
            return
        }
        setRateLimit(command.name, message.author.id)
        Sentry.withMessageScope(message, async () => {
            const transaction = Sentry.startTransaction({
                op: command.name + 'Command',
                name: capitaliseSentence(command.name) + ' Command',
            })
            try {
                await command.execute(client, message, args)
            } catch (error) {
                // Error running command
                Sentry.captureException(error)
                client.logger.error(
                    'messageHandler: Command failed with error: ' + error
                )
                try {
                    await message.reply(getErrorMessage())
                    // eslint-disable-next-line no-empty
                } catch {
                }
            } finally {
                transaction.finish()
            }
        })
    } else {
        if (message.channel.type == 'DM' && process.env.dmChannel) {
            client.logger.verbose(
                `messageHandler: Received a DM from ${message.author.tag}, attempting to notify in the correct channel...`
            )
            const dmChannel = await client.channels.fetch(process.env.dmChannel)
            const embed = new MessageEmbed()
            if (message.content) embed.addField('Contents', message.content)
            if (message.attachments.first())
                embed.setImage(message.attachments.first().url)
            embed.setAuthor(message.author.tag, message.author.avatarURL())
            embed.setFooter(`User ID: ${message.author.id}`)
            embed.setTimestamp(Date.now())
            if (
                dmChannel.type == 'GUILD_TEXT' ||
                dmChannel.type == 'GUILD_NEWS'
            )
                // @ts-expect-error
                await dmChannel.send(embed)
        }
    }
}

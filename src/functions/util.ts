import { AnyChannel, Guild, GuildMember, Message, Role } from 'discord.js'
import { BotClient, Permission } from '../customDefinitions'
import { getInvalidPermissionsMessage } from './messages'
import { request } from 'undici'
import { Logger } from 'winston'
import i18next from 'i18next'
import db from './db'
import is_number = require('is-number')
import { remove as removeFromArray } from 'lodash'
import { BinaryLike, createHash } from 'crypto'

/**
 * Checks permissions against a guild member
 * @param member Guild member to check
 * @param permissions Permissions required
 * @returns Boolean
 */
export function checkPermissions(
    member: GuildMember,
    permissions: Array<Permission>
): boolean {
    let validPermission = true
    if (permissions.includes('OWNER')) {
        permissions = removeItemFromArray(permissions, 'OWNER')
        if (!isBotOwner(member.id)) validPermission = false
    }
    if (permissions.length != 0) {
        // @ts-expect-error
        if (!member.permissions.has(permissions)) validPermission = false
    }
    return validPermission
}

/**
 * Stops the bot and services gracefully
 * @param client Discordjs Client
 * @param stopCode Process exit code, default 0
 */
export async function stopBot(
    client: BotClient | null,
    stopCode = 0
): Promise<void> {
    try {
        if (client) {
            client.logger.warn(
                'util: Received call to stop bot, stopping with code: ' +
                stopCode
            )
            client.destroy()
        }
        await db.$disconnect()
        process.exit(stopCode)
    } catch {
        process.exit()
    }
}

/**
 * Generates a random number between two values
 * @param min Minimum number (inclusive)
 * @param max Maximum number (inclusive)
 * @returns Random number
 */
export function randomInt(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

/**
 *
 * @param message Initiating message
 */
export function returnInvalidPermissionMessage(message: Message): void {
    message.react('❌')
    message.channel.send(getInvalidPermissionsMessage())
}

/**
 * Returns a user from a string, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get the user from
 * @returns GuildMember
 */
export async function getUserFromString(
    guild: Guild,
    text: unknown
): Promise<GuildMember | null> {
    try {
        if (!text) return null
        let stringText = String(text)
        if (stringText.startsWith('<@') && stringText.endsWith('>')) {
            // Mention
            stringText = stringText.slice(2, -1)
            if (stringText.startsWith('!')) {
                stringText = stringText.slice(1)
            }
            if (stringText.startsWith('&')) {
                // Role
                return null
            }
            if (stringText.startsWith('<#')) {
                // Channel
                return null
            }
            return await guild.members.fetch(stringText)
        } else if (is_number(text)) {
            // Plain ID
            return await guild.members.fetch(stringText)
        }
    } catch {
        // eslint-disable-next-line no-empty
    }
    return null
}

/**
 * Returns a user from a string, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get the user from
 * @returns GuildMember
 */
export async function getRoleFromString(
    guild: Guild,
    text: unknown
): Promise<Role | null> {
    try {
        if (!text) return null
        let stringText = String(text)
        if (stringText.startsWith('<@') && stringText.endsWith('>')) {
            // Mention
            stringText = stringText.slice(2, -1)
            if (stringText.startsWith('<#')) {
                // Channel
                return null
            }
            if (stringText.startsWith('&')) {
                // Role
                stringText = stringText.slice(1)
            }

            return await guild.roles.fetch(stringText)
        } else if (is_number(stringText)) {
            // Plain ID
            return await guild.roles.fetch(stringText)
        }
    } catch {
        // eslint-disable-next-line no-empty
    }
    return null
}

/**
 * Returns a channel from a string of text, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get channel from
 * @returns Channel
 */
export async function getChannelFromString(
    guild: Guild,
    text: unknown
): Promise<AnyChannel> {
    try {
        if (!text) return null
        let stringText = String(text)
        if (stringText.startsWith('<@')) {
            // User or role
            return null
        }
        if (stringText.startsWith('<#') && stringText.endsWith('>')) {
            stringText = stringText.slice(2, -1)
            return await guild.client.channels.fetch(stringText)
        } else if (is_number(stringText)) {
            return await guild.client.channels.fetch(stringText)
        } else {
            return guild.channels.cache.find(
                (channel) => channel.name.toLowerCase() === stringText
            )
        }
    } catch {
        return null
    }
}

/**
 * Uploads text to a hastebin host
 * @param logger OPTIONAL winston logger
 * @param dataToUpload Text to upload
 * @returns string Uploaded paste location
 */
export async function uploadToHasteBin(
    logger: Logger,
    dataToUpload: string
): Promise<string | null> {
    if (!dataToUpload) {
        if (logger)
            logger.error(
                'hasteUploader: No content provided to upload, skipping...'
            )
    }
    const hasteLocation = process.env.hasteBinHost ?? 'https://hastebin.com'
    try {
        const response = await request(hasteLocation + '/documents', {
            method: 'POST',
            body: dataToUpload,
        })
        if (response.statusCode != 200) return null
        const responseData = await response.body.json()
        if (responseData.key) return `${hasteLocation}/${responseData.key}`
    } catch (err) {
        if (logger)
            logger.error(
                'hasteUploader: Failed uploading to hastebin with error: ' + err
            )
    }
    return null
}

/**
 * Removes a specified value from an array
 * @param array Input array
 * @param value Value to remove
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeItemFromArray(array: Array<any>, value: unknown): Array<any> {
    return removeFromArray(array, function (n: unknown) {
        return value == n
    })
}

const owners = String(process.env.ownerId).split(',')
/**
 * Checks if a user ID is one of the bot owners
 * @param userId User ID to check
 * @returns Boolean
 */
export function isBotOwner(userId: string) {
    return owners.includes(userId)
}

let thisLogger: Logger
export const saveLogger = (logger: Logger) => {
    thisLogger = logger
}
export const getLogger = () => {
    return thisLogger
}

/**
 * Capitalises the first letter of a sentence
 * @param string Input string
 * @returns string
 */
export function capitaliseSentence(string: string) {
    if (!string) return null
    const str = String(string)
    return str.charAt(0).toUpperCase() + str.slice(1)
}
/**
 * Converts a boolean value to a string representation
 * @param booleanToConvert Boolean to convert
 * @returns
 */
export function booleanToHuman(booleanToConvert: boolean) {
    if (booleanToConvert == true) {
        return i18next.t('misc:ON')
    } else {
        return i18next.t('misc:OFF')
    }
}

/**
 * Returns a promise for the given task
 * @param time miliseconds to wait
 * @returns  Promise
 */
export async function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

/**
 * Hashes data using a specific hash type
 * @param data data to hash
 * @param hashType type of hash to use
 * @returns hash
 */
export function hash(data: BinaryLike, hashType: string) {
    const hash = createHash(hashType)
        .update(data)
        .digest('hex')
    return hash
}

const emojis = [
    '😄', '😃', '😀', '😊', '☺', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑', '👲', '👳', '👮', '👷', '💂', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '👱', '👼', '👸', '😺', '😸', '😻', '😽', '😼', '🙀', '😿', '😹', '😾', '👹', '👺', '🙈', '🙉', '🙊', '💀', '👽', '💩', '🔥', '✨', '🌟', '💫', '💥', '💢', '💦', '💧', '💤', '💨', '👂', '👀', '👃', '👅', '👄', '👍', '👎', '👌', '👊', '✊', '✌', '👋', '✋', '👐', '👆', '👇', '👉', '👈', '🙌', '🙏', '☝', '👏', '💪', '🚶', '🏃', '💃', '👫', '👪', '👬', '👭', '💏', '💑', '👯', '🙆', '🙅', '💁', '🙋', '💆', '💇', '💅', '👰', '🙎', '🙍', '🙇', '🎩', '👑', '👒', '👟', '👞', '👡', '👠', '👢', '👕', '👔', '👚', '👗', '🎽', '👖', '👘', '👙', '💼', '👜', '👝', '👛', '👓', '🎀', '🌂', '💄', '💛', '💙', '💜', '💚', '❤', '💔', '💗', '💓', '💕', '💖', '💞', '💘', '💌', '💋', '💍', '💎', '👤', '👥', '💬', '👣', '💭', '🐶', '🐺', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🐻', '🐷', '🐽', '🐮', '🐗', '🐵', '🐒', '🐴', '🐑', '🐘', '🐼', '🐧', '🐦', '🐤', '🐥', '🐣', '🐔', '🐍', '🐢', '🐛', '🐝', '🐜', '🐞', '🐌', '🐙', '🐚', '🐠', '🐟', '🐬', '🐳', '🐋', '🐄', '🐏', '🐀', '🐃', '🐅', '🐇', '🐉', '🐎', '🐐', '🐓', '🐕', '🐖', '🐁', '🐂', '🐲', '🐡', '🐊', '🐫', '🐪', '🐆', '🐈', '🐩', '🐾', '💐', '🌸', '🌷', '🍀', '🌹', '🌻', '🌺', '🍁', '🍃', '🍂', '🌿', '🌾', '🍄', '🌵', '🌴', '🌲', '🌳', '🌰', '🌱', '🌼', '🌐', '🌞', '🌝', '🌚', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌜', '🌛', '🌙', '🌍', '🌎', '🌏', '🌋', '🌌', '🌠', '⭐', '☀', '⛅', '☁', '⚡', '☔', '❄', '⛄', '🌀', '🌁', '🌈', '🌊', '🎍', '💝', '🎎', '🎒', '🎓', '🎏', '🎆', '🎇', '🎐', '🎑', '🎃', '👻', '🎅', '🎄', '🎁', '🎋', '🎉', '🎊', '🎈', '🎌', '🔮', '🎥', '📷', '📹', '📼', '💿', '📀', '💽', '💾', '💻', '📱', '☎', '📞', '📟', '📠', '📡', '📺', '📻', '🔊', '🔉', '🔈', '🔇', '🔔', '🔕', '📢', '📣', '⏳', '⌛', '⏰', '⌚', '🔓', '🔒', '🔏', '🔐', '🔑', '🔎', '💡', '🔦', '🔆', '🔅', '🔌', '🔋', '🔍', '🛁', '🛀', '🚿', '🚽', '🔧', '🔩', '🔨', '🚪', '🚬', '💣', '🔫', '🔪', '💊', '💉', '💰', '💴', '💵', '💷', '💶', '💳', '💸', '📲', '📧', '📥', '📤', '✉', '📩', '📨', '📯', '📫', '📪', '📬', '📭', '📮', '📦', '📝', '📄', '📃', '📑', '📊', '📈', '📉', '📜', '📋', '📅', '📆', '📇', '📁', '📂', '✂', '📌', '📎', '✒', '✏', '📏', '📐', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📚', '📖', '🔖', '📛', '🔬', '🔭', '📰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🎻', '🎺', '🎷', '🎸', '👾', '🎮', '🃏', '🎴', '🀄', '🎲', '🎯', '🏈', '🏀', '⚽', '⚾', '🎾', '🎱', '🏉', '🎳', '⛳', '🚵', '🚴', '🏁', '🏇', '🏆', '🎿', '🏂', '🏊', '🏄', '🎣', '☕', '🍵', '🍶', '🍼', '🍺', '🍻', '🍸', '🍹', '🍷', '🍴', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍛', '🍤', '🍱', '🍣', '🍥', '🍙', '🍘', '🍚', '🍜', '🍲', '🍢', '🍡', '🍳', '🍞', '🍩', '🍮', '🍦', '🍨', '🍧', '🎂', '🍰', '🍪', '🍫', '🍬', '🍭', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅', '🌽', '🏠', '🏡', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏩', '🏨', '💒', '⛪', '🏬', '🏤', '🌇', '🌆', '🏯', '🏰', '⛺', '🏭', '🗼', '🗾', '🗻', '🌄', '🌅', '🌃', '🗽', '🌉', '🎠', '🎡', '⛲', '🎢', '🚢', '⛵', '🚤', '🚣', '⚓', '🚀', '✈', '💺', '🚁', '🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚃', '🚎', '🚌', '🚍', '🚙', '🚘', '🚗', '🚕', '🚖', '🚛', '🚚', '🚨', '🚓', '🚔', '🚒', '🚑', '🚐', '🚲', '🚡', '🚟', '🚠', '🚜', '💈', '🚏', '🎫', '🚦', '🚥', '⚠', '🚧', '🔰', '⛽', '🏮', '🎰', '♨', '🗿', '🎪', '🎭', '📍', '🚩', '⬆', '⬇', '⬅', '➡', '🔠', '🔡', '🔤', '↗', '↖', '↘', '↙', '↔', '↕', '🔄', '◀', '▶', '🔼', '🔽', '↩', '↪', 'ℹ', '⏪', '⏩', '⏫', '⏬', '⤵', '⤴', '🆗', '🔀', '🔁', '🔂', '🆕', '🆙', '🆒', '🆓', '🆖', '📶', '🎦', '🈁', '🈯', '🈳', '🈵', '🈴', '🈲', '🉐', '🈹', '🈺', '🈶', '🈚', '🚻', '🚹', '🚺', '🚼', '🚾', '🚰', '🚮', '🅿', '♿', '🚭', '🈷', '🈸', '🈂', 'Ⓜ', '🛂', '🛄', '🛅', '🛃', '🉑', '㊙', '㊗', '🆑', '🆘', '🆔', '🚫', '🔞', '📵', '🚯', '🚱', '🚳', '🚷', '🚸', '⛔', '✳', '❇', '❎', '✅', '✴', '💟', '🆚', '📳', '📴', '🅰', '🅱', '🆎', '🅾', '💠', '➿', '♻', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔯', '🏧', '💹', '💲', '💱', '©', '®', '™', '〽', '〰', '🔝', '🔚', '🔙', '🔛', '🔜', '❌', '⭕', '❗', '❓', '❕', '❔', '🔃', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '✖', '➕', '➖', '➗', '♠', '♥', '♣', '♦', '💮', '💯', '✔', '☑', '🔘', '🔗', '➰', '🔱', '🔲', '🔳', '◼', '◻', '◾', '◽', '▪', '▫', '🔺', '⬜', '⬛', '⚫', '⚪', '🔴', '🔵', '🔻', '🔶', '🔷', '🔸', '🔹'
]

/**
 * Returns a random emoji
 * @returns Emoji
 */
export function randomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)]
}

/**
 * Returns a random hex code
 * @returns Hex Code
 */
export function randomHexCode() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

import { GLOBAL_RATELIMIT_DURATION } from '../consts'
const rateLimits = new Map()

/**
 * Checks whether a user should be rate limited
 * @param commandName Name of command
 * @param commandLimit Rate limit of command in seconds
 * @param userId User ID to check
 * @returns Boolean
 */
export function checkRateLimit(commandName: string, commandLimit: number | undefined, userId: string): boolean {
    if (!commandLimit) commandLimit = GLOBAL_RATELIMIT_DURATION
    const rateLimit = rateLimits.get(`${commandName}-${userId}`) ?? 0
    if (Date.now() < (commandLimit * 1000) + rateLimit) return true
    return false
}

/**
 * Sets a rate limit when a user runs a command
 * @param commandName Name of command
 * @param userId User ID to rate limit
 */
export function setRateLimit(commandName: string, userId: string) {
    rateLimits.set(`${commandName}-${userId}`, Date.now())
}

/**
 * Gets the time remaining for a rate limit
 * @param commandName Name of command
 * @param commandLimit Rate limit of command in seconds
 * @param userId User ID to check
 * @returns Time remaining in MS
 */
export function getRateLimitRemaining(commandName: string, commandLimit: number | undefined, userId: string) {
    if (!commandLimit) commandLimit = GLOBAL_RATELIMIT_DURATION
    const rateLimit = rateLimits.get(`${commandName}-${userId}`)
    if (!rateLimit) return 0
    return commandLimit * 1000 - (Date.now() - rateLimit)
}

export function warnForOmittedEnvs(logger: Logger) {
    if (!process.env.ownerId || !process.env.ownerName) {
        logger.warn('Owner information not provided in .env')
    }
    if (!process.env.guildLogChannel || !process.env.dmChannel) {
        logger.warn('Guild log channel(s) not provided in .env')
    }
    if (!process.env.devServerId) {
        logger.warn('Dev server ID not provided in .env')
    }
    if (!process.env.errorLogWebhookUrl) {
        logger.warn('Error webhook not provided in .env')
    }
    if (!process.env.sentryUrl) {
        logger.warn('Sentry url not provided in .env')
    }
    if (!process.env.twitchNotificationsChannel || !process.env.twitchNotificationsUsername) {
        logger.warn('Twitch channel information not provided in .env')
    }
    if (!process.env.twitchApiSecret || !process.env.twitchApiClientId) {
        logger.warn('Twitch auth credentials not provided in .env')
    }
    if (!process.env.bingImageSearchKey || !process.env.pexelsApiKey) {
        logger.warn('Image auth credentials not specified in .env')
    }
}

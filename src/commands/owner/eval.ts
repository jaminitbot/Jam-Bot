import {Message, MessageEmbed} from "discord.js"
import {client} from '../../customDefinitions'
import {uploadToHasteBin} from '../../functions/util'

const secrets = [
    process.env.token,
    process.env.mongoUrl,
    process.env.twitchApiSecret,
    process.env.twitchApiClientId,
    process.env.pexelsApiKey
].filter(Boolean)

const secretsRegex = RegExp(secrets.join('|'), 'g')
export const name = 'eval'
export const description = 'Executes code'
export const usage = 'eval 1+1'
export const permissions = ['OWNER']

export async function execute(client: client, message: Message, args) {
    if (!args[0]) return message.channel.send('Do you just expect me to guess at what you want to run?')
    const embed = new MessageEmbed
    const command = args.splice(0).join(' ')
    embed.setTitle('Eval')
    embed.addField('Command', command)
    embed.setDescription('Executing command...')
    const sentMessage = await message.channel.send(embed)
    let commandOutput
    try {
        commandOutput = await eval(command)
    } catch (error) {
        commandOutput = error
    }
    commandOutput = String(commandOutput)
        .replace(secretsRegex, '[secret]')
    commandOutput = String(commandOutput)
    if (commandOutput.length > 1024) {
        const uploadedHasteLocation = await uploadToHasteBin(client.logger, commandOutput)
        if (uploadedHasteLocation) {
            embed.addField('Output', `Output was too large for discord, uploaded to hastebin: ${uploadedHasteLocation}`)
        } else {
            embed.addField('Output', 'Output was too large for discord, but we failed uploading it to hastebin :(')
        }
    } else {
        embed.addField('Output', commandOutput)
    }

    sentMessage.edit(embed)
}

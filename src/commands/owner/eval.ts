import {CommandInteraction, Message, MessageEmbed} from "discord.js"
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
export const exposeSlash = false
export const slashCommandOptions = [{
    name: 'command',
    type: 'STRING',
    description: 'The command to execute',
    required: true
}]
async function runEvalCommand(commandToRun, logger) {
    const embed = new MessageEmbed
    embed.setTitle('Eval')
    embed.addField('Command', commandToRun)
    let commandOutput
    try {
        commandOutput = await eval(commandToRun)
    } catch (error) {
        commandOutput = error
    }
    commandOutput = String(commandOutput)
        .replace(secretsRegex, '[secret]')
    commandOutput = String(commandOutput)
    if (commandOutput.length > 1024) {
        const uploadedHasteLocation = await uploadToHasteBin(logger, commandOutput)
        if (uploadedHasteLocation) {
            embed.addField('Output', `Output was too large for discord, uploaded to hastebin: ${uploadedHasteLocation}`)
        } else {
            embed.addField('Output', 'Output was too large for discord, but we failed uploading it to hastebin :(')
        }
    } else {
        embed.addField('Output', commandOutput)
    }
    return embed
}
export async function execute(client: client, message: Message, args) {
    if (!args[0]) return message.channel.send('Do you just expect me to guess at what you want to run?')
    const command = args.splice(0).join(' ')
    const sentMessage = await message.channel.send({content: 'Executing command...'})
    const embed = await runEvalCommand(command, client.logger)
    sentMessage.edit({embeds: [embed]})
}
export async function executeSlash(client, interaction:CommandInteraction) {
    await interaction.defer()
    const command = interaction.options.getString('command')
    const embed = await runEvalCommand(command, client.logger)
    interaction.editReply({embeds: [embed]})
}

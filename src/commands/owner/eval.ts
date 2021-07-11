import { Message, MessageEmbed } from "discord.js"
import { client } from '../../customDefinitions'
import { getInvalidPermissionsMessage } from '../../functions/messages'
const secrets = [
	process.env.token,
	process.env.MONGO_URL,
	process.env.twitchApiSecret,
	process.env.twitchApiClientId,
	process.env.pexelsApiKey
].filter(Boolean)
const secretsRegex = RegExp(secrets.join('|'), 'g')
export const name = 'eval'
export const description = 'Executes code'
export const usage = 'eval 1+1'
export async function execute(client: client, message: Message, args) {
	if (message.author.id == process.env.OWNERID) {
		const embed = new MessageEmbed
		const command = args.splice(0).join(' ')
		embed.setTitle('Eval')
		embed.addField('Command', command)
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
			commandOutput = commandOutput.substring(0, commandOutput.length - (commandOutput.length - 1024))
			embed.addField('NOTE', 'Output was truncated to send via discord')
		}
		embed.addField('Output', commandOutput)
		message.channel.send(embed)
	} else {
		message.channel.send(getInvalidPermissionsMessage())
	}
}

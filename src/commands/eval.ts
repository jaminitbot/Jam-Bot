import { Message, MessageEmbed } from "discord.js"
import { client } from '../customDefinitions'
import { Logger } from "winston"
import { getInvalidPermissionsMessage } from '../functions/messages'

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
		embed.addField('Output', commandOutput)
		message.channel.send(embed)
	} else {
		message.channel.send(getInvalidPermissionsMessage())
	}
}

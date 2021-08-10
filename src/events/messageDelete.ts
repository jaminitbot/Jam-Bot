import { Message } from "discord.js"
import { client } from '../customDefinitions'
import { getKey } from '../functions/db'
import { inputSnipe } from '../functions/snipe'

export default async function register(client: client, message: Message): Promise<void> {
	if (!(message.channel.type == 'GUILD_NEWS' || message.channel.type == 'GUILD_TEXT')) return
	if (message.author.bot) return
	if (message.author.id == process.env.ownerId) return
	await inputSnipe(message, null, 'delete')
	//#region Delete log code
	const logDeletes = await getKey(message.guild.id, 'logDeletedMessages')
	if (logDeletes) {
		const modLogChannelId = await getKey(message.guild.id, 'modLogChannel')
		if (!modLogChannelId) return
		const modLogChannel = await client.channels.fetch(modLogChannelId)
		if (!modLogChannel || !((modLogChannel.type == 'GUILD_TEXT') || modLogChannel.type == 'GUILD_NEWS')) return
		let urls = ''
		if (message.attachments) {
			message.attachments.each(attachment => {
				urls += '\n' + attachment.url
			})
		}
		const embed = {
			title: 'Message deleted',
			description: `Message deleted in <#${message.channel.id}> by <@${message.author.id}>:\n\`\`\`${message.content || 'NULL'}\`\`\`Attachments:${urls || 'NONE'}`,
			color: ' #FF0000',
			timestamp: Date.now(),
		}
		// @ts-expect-error
		modLogChannel.send({ embeds: [embed] })
	}
	//#endregion
}

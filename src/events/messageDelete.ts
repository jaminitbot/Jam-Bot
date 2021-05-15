import { Message } from "discord.js"
import { client } from '../custom'
import { getKey } from '../functions/db'

module.exports = {
	async register(client: client, message: Message) {
		if (message.author.bot) return
		if (message.author.id == process.env.OWNERID) return
		let logDeletes = await getKey(message.guild.id, 'logDeletedMessages')
		if (logDeletes) {
			let modLogChannnel = await getKey(message.guild.id, 'modLogChannel')
			if (!modLogChannnel) return
			modLogChannnel = await client.channels.cache.get(modLogChannnel)
			if (!modLogChannnel) return
			let embed = {
				title: 'Message deleted',
				description: `Message deleted in ${message.channel} by ${message.author
					}:\n\`\`\`${message.content || 'NULL'}\`\`\``,
				color: ' #FF0000',
				timestamp: Date.now(),
			}
			modLogChannnel.send({ embed: embed })
		}
	},
}

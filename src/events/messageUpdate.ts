import {Message} from "discord.js";
import {inputSnipe} from '../functions/snipe'

export default async function register(oldMessage: Message, newMessage: Message):Promise<void> {
	if (!(newMessage.channel.type == 'GUILD_TEXT' || newMessage.channel.type == 'GUILD_NEWS')) return
	if (newMessage.author.bot) return
	if (newMessage.author.id == process.env.ownerId) return
	await inputSnipe(newMessage, oldMessage, 'edit')
}
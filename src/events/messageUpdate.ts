import {Message} from "discord.js";
import {inputSnipe} from '../functions/snipe'

export default async function register(oldMessage: Message, newMessage: Message):Promise<void> {
	if (!(newMessage.channel.type == 'news' || newMessage.channel.type == 'text')) return
	if (newMessage.author.bot) return
	if (newMessage.author.id == process.env.OWNERID) return
	await inputSnipe(newMessage, oldMessage, 'edit')
}
import { Message } from "discord.js";
import { inputSnipe } from '../functions/snipe'
export default function register(oldMessage: Message, newMessage: Message) {
	if (!(newMessage.channel.type == 'news' || newMessage.channel.type == 'text')) return
	if (newMessage.author.bot) return
	if (newMessage.author.id == process.env.OWNERID) return
	inputSnipe(newMessage, oldMessage, 'edit')
}
import { Message } from "discord.js";
import { client } from "../custom";
import { inputSnipe } from '../functions/snipe'
export function register(client: client, oldMessage: Message, newMessage: Message) {
	if (!(newMessage.channel.type == 'news' || newMessage.channel.type == 'text')) return
	if (newMessage.author.bot) return
	if (newMessage.author.id == process.env.OWNERID) return
	inputSnipe(newMessage, oldMessage, 'edit')
}
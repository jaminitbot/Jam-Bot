import { Message } from "discord.js"
import { Logger } from "winston"
import KickOrBan from '../functions/kickorban'
import { client } from '../custom'

export let name = 'ban'
export let description = 'Bans a user from the server'
export let permissions = ['BAN_MEMBERS']
export let usage = 'ban @user'
export function execute(client: client, message: Message, args, db, logger: Logger) {
	KickOrBan(message, args, 'ban')
}

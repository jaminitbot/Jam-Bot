import { Message } from "discord.js"
import KickOrBan from '../../functions/kickorban'
import { client } from '../../customDefinitions'

export const name = 'ban'
export const description = 'Bans a user from the server'
export const permissions = ['BAN_MEMBERS']
export const usage = 'ban @user'
export const slashCommandOptions = [{
	name: 'user',
	type: 'USER',
	description: 'The user to ban',
	required: true
},
	{
		name: 'reason',
		type: 'STRING',
		description: '(optional) reason to ban the user',
		required: false
	}]
export function execute(client: client, message: Message, args) {
	KickOrBan(message, args, 'ban')
}

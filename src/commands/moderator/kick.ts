import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import kickOrBan from '../../functions/kickorban'

export const name = 'kick'
export const description = 'Kicks a user from the server'
export const permissions = ['KICK_MEMBERS']
export const usage = 'kick @user'
export const slashCommandOptions = [{
	name: 'user',
	type: 'USER',
	description: 'The user to kick',
	required: true
},
	{
		name: 'reason',
		type: 'STRING',
		description: '(optional) reason to kick the user',
		required: false
	}]
export async function execute(client: client, message: Message, args) {
	kickOrBan(message, args, 'kick')
}

import { Message } from "discord.js"
import { client } from '../../customDefinitions'
import kickOrBan from '../../functions/kickorban'

export const name = 'kick'
export const description = 'Kicks a user from the server'
export const permissions = ['KICK_MEMBERS']
export const usage = 'kick @user'
export async function execute(client: client, message: Message, args) {
	kickOrBan(message, args, 'kick')
}

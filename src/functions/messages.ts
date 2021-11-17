/* eslint-disable no-undef */
import { randomInt } from './util'

const wrongPermissions = [
	'Nice try. Invalid Permissions.',
	"Not this time. You don't have the required permissions!",
	"Nope, you don't have the correct permissions!",
	'No thanks. Wrong permissions!',
	"That ain't gonna work with your permissions",
	'No sorry. Invalid permissions!',
	'Permissions say no.',
	"NO, your permissions don't add up!",
	'Pffft, wrong permissions!',
	'Bot says no. Your permissions are not there.',
	'As if. Not working with those permissions!',
	"Why did you even try that. You don't have the required permissions!",
	"Did you really just do that? Your permissions just aren't there!",
	'Try again when you have permissions.',
	'Ha, you really thought that would work with your permissions??!',
	'Really? Not with your permissions!',
	"You'd never be allowed to do that with those permissions :D",
	"As if you'd be trusted with that with your permissions!",
	'I think not. Not with those permissions',
	'Ha, no. Permissions say no.',
	'STOP. YOU DONT HAVE THE CORRECT PERMISSIONS!',
	'Not today. Permissions say no.',
	'Imagine thinking that would work with those permissions.',
	"Silly, that's not working with your lame permissions :)",
	'Stop trying with your permissions.',
]
const errorMessages = [
	"Whoops, that didn't work, please file an issue if this continues",
	'Something went wrong, please try again later',
	'Ooops, something went wrong running that command, sorry :(',
]
const happyMessages = [
	'PogChamp,',
	':partying_face:',
	':red_circle:',
	'Honk,',
	'YAY!',
	'Hurray!',
]
/**
 * Gets a random error message
 * @returns String
 */
export function getErrorMessage(): string {
	return errorMessages[randomInt(0, errorMessages.length - 1)]
}
/**
 * Returns a random invalid permission message
 * @returns String
 */
export function getInvalidPermissionsMessage(): string {
	return wrongPermissions[randomInt(0, wrongPermissions.length - 1)]
}
/**
 * Returns a random positive message
 * @returns String
 */
export function getHappyMessage(): string {
	return happyMessages[randomInt(0, happyMessages.length - 1)]
}

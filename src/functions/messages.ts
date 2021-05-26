/* eslint-disable no-undef */
const wrongPermissions = [
	'Nice try.',
	'Not this time.',
	'No.',
	'No thanks.',
	"Don't.",
	"That ain't gonna work",
	'No sorry.',
	'Permissions say no.',
	'NO',
	'Pffft',
	'Bot says no.',
	'As if.',
	'Why did you even try that.',
	'Did you really just do that?',
	'Try again when you have permissions',
	'Ha, you really thought that would work.',
	'Really?',
	"You'd never be allowed to do that.",
	"As if you'd be trusted with that.",
	'I think not.',
	'...',
	'Ha, no.',
	'STOP.',
	'Not today.',
	'Imagine thinking that would work',
	"Silly, that's not working with your lame permissions :)",
	'Stop trying...',
	'Ha, no.',
	'I-',
]
const errorMessages = ["Whoops, that did't work", 'Something went wrong']
const happyMessages = [
	'PogChamp,',
	':partying_face:',
	':red_circle:',
	'Honk,',
	'YAY!',
	'Hurray!',
]
/**
 * 
 * @returns String
 */
export function getErrorMessage(): string {
	return errorMessages[
		Math.floor(Math.random() * (errorMessages.length - 1))
	]
}
/**
 * 
 * @returns String
 */
export function getInvalidPermissionsMessage(): string {
	return wrongPermissions[
		Math.floor(Math.random() * (wrongPermissions.length - 1))
	]
}
/**
 * 
 * @returns String
 */
export function getHappyMessage(): string {
	return happyMessages[
		Math.floor(Math.random() * (happyMessages.length - 1))
	]
}

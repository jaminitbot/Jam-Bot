/* eslint-disable no-undef */
const random = require('random')
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
    'Noob',
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
    'Your permissions do not match the required permissions',
    'Stop trying...',
    'Ha, no.',
    'I-',
]
const errorMessages = ["Whoops, that did't work", 'Something went wrong']
const happyMessages = [
    'PogChamp',
    ':partying_face:',
    ':red_circle:',
    'Honk,',
    'YAY!',
    'Hurray!',
]
module.exports = {
    getErrorMessage() {
        return errorMessages[
            random.int((min = 0), (max = errorMessages.length - 1))
        ]
    },
    getInvalidPermissionsMessage() {
        return wrongPermissions[
            random.int((min = 0), (max = wrongPermissions.length - 1))
        ]
    },
    getHappyMessage() {
        return happyMessages[
            random.int((min = 0), (max = happyMessages.length - 1))
        ]
    },
}

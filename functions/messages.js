const random = require('random')
const wrongPermissions = ['Nice try.', 'Not this time.', 'No.', 'No thanks.', 'Don\'t.', 'That ain\'t gonna work', 'No sorry.', 'Permissions say no.', 'NO', 'Pffft', 'Bot says no.', 'As if.', 'Why did you even try that.', 'Did you really just do that?', 'Try again when you have permissions', 'Noob']
const errorMessages = ['that didn\'t work', 'try again later', 'oops, we messed up', 'I couldn\'t do that matey']
module.exports = {
    getErrorMessage(){
        return errorMessages[random.int(min=0, max=errorMessages.length-1)]
    },
    getPermissionsMessage(){
        return wrongPermissions[random.int(min=0, max=wrongPermissions.length-1)]
    }
}
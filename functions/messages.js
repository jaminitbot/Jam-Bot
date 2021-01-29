const random = require('random')
const wrongPermissions = ['Nice try.', 'Not this time.', 'No.', 'No thanks.', 'Don\'t.', 'That ain\'t gonna work', 'No sorry.', 'Permissions say no.', 'NO', 'Pffft', 'Bot says no.', 'As if.', 'Why did you even try that.', 'Did you really just do that?', 'Try again when you have permissions', 'Noob', 'Ha, you really thought that would work.', 'Really?', 'You\'d never be allowed to do that.', 'As if you\'d be trusted with that.', 'I think not.', '...', 'Ha, no.', 'STOP.', 'Not today.']
const errorMessages = ['that didn\'t work', 'try again later', 'oops, we messed up', 'I couldn\'t do that matey', 'something went wrong', 'Damn it, James messed up the code', 'James didn\'t code the command right,', 'uwu wooks wike we made a wittwe mistake, twy again watew']
const jimp = ['stfu', 'no u', 'stfu dom', 'no jimp', 'no']
module.exports = {
  getErrorMessage () {
    return errorMessages[random.int(min = 0, max = errorMessages.length - 1)]
  },
  getPermissionsMessage () {
    return wrongPermissions[random.int(min = 0, max = wrongPermissions.length - 1)]
  },
  getJimpMessage(){
	return jimp[random.int(min = 0, max = jimp.length - 1)]
  }
}

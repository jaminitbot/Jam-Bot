const config = require('../config.json')
module.exports = {
    checkperm(member, permissions){
        if (member.hasPermission(permissions) || member.id == config.settings.owner){
            return true
        }
        return false
    }
}
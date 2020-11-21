const prefix = require('./settings/prefix')
const modLog = require('./settings/modlog')

module.exports = {
	name: 'settings',
	description: 'Settings tings',
	execute(client, message, args, db,) {
        const embed = {
            "title": "Settings",
            "description": "prefix: Sets the prefix for the bot\nmodlog: Various modlog commands",
            "color": 7135759
        }
        let setting = args[0]
        if (!setting){
            message.channel.send({ embed: embed })
            return
        }
        switch(String(setting).toLowerCase()){
            case 'prefix':
                prefix.execute(client, message, args, db)
                return
            case 'modlog':
                modLog.execute(client, message, args, db)
                return
            default:
                message.channel.send({ embed: embed })
                return
        }
	},
};
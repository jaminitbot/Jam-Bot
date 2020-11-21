const prefix = require('./settings/prefix')
module.exports = {
	name: 'settings',
	description: 'Settings tings',
	execute(client, message, args, db,) {
        const embed = {
            "title": "Settings",
            "description": "prefix: Sets the prefix for the bot",
            "color": 7135759
        }
        if (!args[0]){
            message.channel.send({ embed: embed })
            return
        }
        let setting = args[0]
        switch(setting){
            case 'prefix':
                prefix.execute(client, message, args, db)
                return
            default:
                message.channel.send({ embed: embed })
        }
	},
};
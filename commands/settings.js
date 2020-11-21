const { Channel } = require("discord.js");

module.exports = {
	name: 'settings',
	description: 'Settings tings',
	execute(client, message, args, db,) {
        if (!args[0]){
            const embed = {
                "title": "Settings",
                "description": "prefix: Sets the prefix for the bot",
                "color": 7135759
            }
            message.channel.send({ embed: embed })
            return
        }
        let setting = args[0]
        switch(setting){
            case 'prefix':
                if (!args[1]) return message.channel.send('You need to specify a prefix!')
                db.run('UPDATE "' + message.guild.id + '" SET \'value\' = \'' + args[1] + '\' WHERE key=\'prefix\'', (err) => {
                    if (err) {
                        return console.error(err.message);
                    }   
                })
        }
	},
};
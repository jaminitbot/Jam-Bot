const gis = require('g-i-s');
module.exports = {
	name: 'image',
	description: 'Gets a image',
	usage: 'image duck',
	execute(client, message, args, db) {
        if (!args[0]) return message.channel.send('You need to search for something')
        gis(args[0], function(error, results){
            if (error) return
            message.channel.send(results[0].url)
        })
	},
};
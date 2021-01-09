const gis = require('g-i-s');
module.exports = {
	name: 'image',
	description: 'Gets a image',
	usage: 'image duck',
	execute(client, message, args, db) {
        if (!args[0]) return message.channel.send('You need to search for something')
        let search = args.splice(1).join(' ')
        gis(search, function(error, results){
            if (error) return
            message.channel.send(results[0].url)
        })
	},
};
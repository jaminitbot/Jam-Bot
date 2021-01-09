const gis = require('g-i-s')
const isImage = require('is-image')
module.exports = {
	name: 'image',
	description: 'Gets a image',
	usage: 'image duck',
	async execute(client, message, args, db) {
        if (!args[0]) return message.channel.send('You need to search for something')
        let search = args.splice(0).join(' ')
        let done = false
        gis(search, function(error, results){
            if (error) return
            results.forEach(element => {
                if (isImage(element.url)){
                    if (!done){
                        done = true
                        return message.channel.send(element.url)
                    }
                }
            })
        })
	},
};
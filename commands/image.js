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
        const opts = {
            searchTerm: search,
            queryStringAddition: '&safe=active'
        }
        messagething = 1
        await gis(opts, function(error, results){
            if (error) return
            results.forEach(element => {
                if (isImage(element.url)){
                    if (!done){
                        done = true
                        messagething = message.channel.send(element.url)
                    }
                }
            })
        })
            .then(function(){
                if (!done) {
                    return message.channel.send('Couldn\'t find an image, try searching something else!')
                }
            })
        
	},
};
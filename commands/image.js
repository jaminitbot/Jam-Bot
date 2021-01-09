const gis = require('g-i-s')
const isImage = require('is-image')
module.exports = {
	name: 'image',
	description: 'Gets a image',
	usage: 'image duck',
	async execute(client, message, args, db) {
        if (!args[0]) return message.channel.send('You need to search for something')
        if (typeof args[0] == 'number') {
            var splitBy = 1
        } else {
            var splitBy = 0
        }
        let search = args.splice(splitBy).join(' ')
        let done = false
        const opts = {
            searchTerm: search,
            queryStringAddition: '&safe=active'
        }
        var urls = []
        gis(opts, function(error, results){
            if (error) return
            results.forEach(element => {
                if (isImage(element.url)){
                        done = true
                        urls.push(element.url)
                        // message.channel.send(element.url)
                }
            })
            if (splitBy == 0) {
                message.channel.send(urls[0] || 'No image found')
            } else {
                message.channel.send(urls[args[0] -1] || 'There isn\'t an image for position ' + args[0])
            }
        })
	}
}
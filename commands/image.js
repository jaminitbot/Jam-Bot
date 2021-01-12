const gis = require('g-i-s')
const isImage = require('is-image')
const isNumber = require('is-number');
let opts = {
    searchTerm: '',
    queryStringAddition: '&safe=active' // Enable safe search, better than nothing
}
module.exports = {
	name: 'image',
	description: 'Gets a image',
	usage: 'image duck',
	async execute(client, message, args, db) {
        if (!args[0]) return message.reply('You need to specify what to search for!')
        let splitBy = 0
        if (isNumber(args[0])) {
            splitBy = 1
        }
        opts.searchTerm = args.splice(splitBy).join(' ')
        let urls = []
        gis(opts, function(error, results){
            if (error) return
            results.forEach(element => {
                if (isImage(element.url)){
                        urls.push(element.url)
                }
            })
            if (splitBy == 0) { // Not specified image location
                message.channel.send(urls[0] || 'No image found for your search')
            } else { // Get specific image
                message.channel.send(urls[args[0] - 1] || 'There isn\'t an image for position: ' + args[0])
            }
        })
	}
}
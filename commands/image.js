const gis = require('g-i-s')
const isImage = require('is-image')
const isNumber = require('is-number')
const searchOptions = {
	searchTerm: '',
	queryStringAddition: '&safe=active' // Enable safe search, better than nothing filters most things
}
module.exports = {
	name: 'image',
	description: 'Gets a image',
	usage: 'image duck',
	async execute(client, message, args, db) {
		if (!args[0]) return message.reply('You need to specify what to search for!')
		message.channel.send(':mag_right: Finding image...').then(sent => {
			let splitBy = 0
			if (isNumber(args[0])) { // User wants to get a specific result
				if (args[0] < 1) {
					return sent.edit('You can\'t get that position silly!')
				}
				splitBy = 1 // Make sure we don't include the pos in the search
			}
			const search = args.splice(splitBy).join(' ')
			searchOptions.searchTerm = search
			const validImageUrls = []
			gis(searchOptions, function (error, results) {
				if (error) return sent.edit('An error occured when getting your results :c')
				results.forEach(element => {
					if (isImage(element.url)) {
						validImageUrls.push(element.url)
					}
				})
				if (splitBy == 0) { // Not specified image result
					sent.edit(validImageUrls[0] || 'No image found for your search')
				} else { // Get specific image
					sent.edit(validImageUrls[args[0] - 1] || 'There isn\'t an image for position: ' + args[0])
				}
			})

		})

	}
}

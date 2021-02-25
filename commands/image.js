const gis = require('g-i-s')
const isImage = require('is-image')
const isNumber = require('is-number')
const messages = require('../functions/messages')
module.exports = {
	name: 'image',
	description: 'Searches google for an image',
	usage: 'image duck',
	async execute(client, message, args, db, logger) {
		let type
		if (String(message).includes('gif')) {
			type = 'gif'
		} else {
			type = 'image'
		}
		// if (message.author.id == '582305080200396811') return message.channel.send(messages.getPermissionsMessage())
		let searchOptions = {
			searchTerm: '',
		}
		if (!args[0]) return message.reply('You need to specify what to search for!')
		if (!String(message.channel.name).toLowerCase().includes('nsfw')) { // Nsfw channels can bypass safe search
			searchOptions.queryStringAddition = '&safe=active' // Enable safe search, better than nothing filters most things
		}
		let splitBy = 0
		if (isNumber(args[0])) { // User wants to get a specific result
			if (args[0] < 1) {
				return message.reply('you can\'t get a position less than one silly!')
			}
			splitBy = 1 // Make sure we don't include the pos in the search
		}
		message.channel.send(`:mag_right: Finding ${type}...`).then(sent => {
			const search = args.splice(splitBy).join(' ')
			searchOptions.searchTerm = search
			let validImageUrls = []
			gis(searchOptions, function (error, results) {
				if (error) return sent.edit('An error occured when getting your results :c')
				results.forEach(element => {
					if (isImage(element.url)) {
						validImageUrls.push(element.url)
					}
				})
				if (splitBy == 0) { // Not specified image result
					sent.edit(validImageUrls[0] || `No ${type} found for your search.`)
				} else { // Get specific image
					sent.edit(validImageUrls[args[0] - 1] || `There isn\'t an ${type} for position: ` + args[0])
				}
			})

		})

	}
}

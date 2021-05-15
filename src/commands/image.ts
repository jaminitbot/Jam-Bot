const gis = require('g-i-s')
const isImage = require('is-image')
const isNumber = require('is-number')
const messages = require('../functions/messages')
export {}
module.exports = {
    name: 'image',
    description: 'Searches google for an image',
    usage: 'image duck',
    async execute(client, message, args, db, logger?) {
        if (!args[0])
            return message.reply('you need to specify what to search for!')
        let splitBy = 0
        if (isNumber(args[0])) {
            // User wants to get a specific result
            if (args[0] < 1) {
                return message.reply(
                    "you can't get a position less than one silly!"
                )
            }
            splitBy = 1 // Make sure we don't include the position in the search
        }
        let type
        //#region Janky Gif Code
        if (args[args.length - 1] == 'gif') {
            // Gif commands also uses google image search, update wording accordingly
            type = 'gif'
        } else {
            type = 'image'
        }
        //#endregion
        let searchOptions = {}
        if (!String(message.channel.nsfw)) {
            // Nsfw channels can bypass safe search
			// @ts-expect-error
            searchOptions.queryStringAddition = '&safe=active' // Enable safe search, better than nothing, filters most things
        }
        message.channel.send(`:mag_right: Finding ${type}...`).then((sent) => {
			const search = args.splice(splitBy).join(' ')
			// @ts-expect-error
            searchOptions.searchTerm = search
            let validImageUrls = []
            gis(searchOptions, function (error, results) {
                if (error)
                    return sent.edit(
                        'An error occured while getting your results :c'
                    )
                results.forEach((element) => {
                    if (isImage(element.url)) {
                        validImageUrls.push(element.url)
                    }
                })
                if (splitBy == 1) {
                    // Get specific image at position
                    sent.edit(
                        validImageUrls[args[0] - 1] ||
                            `There isn't an ${type} for position: ` + args[0]
                    )
                } else {
                    sent.edit(
                        validImageUrls[0] || `No ${type} found for your search.`
                    )
                }
            })
        })
    },
}

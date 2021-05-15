const image = require('./image')
export {}
module.exports = {
    name: 'melon',
    description: 'Watermelon',
    usage: 'melon',
	execute(client, message, args, db, logger) {
		// @ts-ignore
        let tempArgs = [random.int((min = 1), (max = 25)), 'watermelon'] // eslint-disable-line no-undef
        image.execute(client, message, tempArgs, db)
    },
}

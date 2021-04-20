const image = require('./image')
const random = require('random')
module.exports = {
    name: 'forg',
    description: 'Frog',
    usage: 'frog',
    execute(client, message, args, db, logger) {
        let tempArgs = [random.int((min = 1), (max = 25)), 'frog'] // eslint-disable-line no-undef
        image.execute(client, message, tempArgs, db)
    },
}

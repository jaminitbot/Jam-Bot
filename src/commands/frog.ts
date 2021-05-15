const image = require('./image')
const random = require('random')
export {}
module.exports = {
    name: 'forg',
    description: 'Frog',
    usage: 'frog',
    execute(client, message, args, db, logger) {
        // @ts-expect-error
        let tempArgs = [random.int((min = 1), (max = 25)), 'frog'] // eslint-disable-line no-undef
        image.execute(client, message, tempArgs, db)
    },
}

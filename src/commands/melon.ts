const image = require('./image')
module.exports = {
    name: 'melon',
    description: 'Watermelon',
    usage: 'melon',
    execute(client, message, args, db, logger) {
        let tempArgs = [random.int((min = 1), (max = 25)), 'watermelon'] // eslint-disable-line no-undef
        image.execute(client, message, tempArgs, db)
    },
}

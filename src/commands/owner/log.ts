import {Message} from "discord.js"
import {client} from '../../customDefinitions'
const fs = require('fs')
import {uploadToHasteBin} from '../../functions/util'

export const name = 'log'
export const description = 'Uploads the log for easy viewing'
export const usage = 'log error|combined'
export const aliases = ['uploadlog']
export async function execute(client: client, message: Message, args) {
    if (message.author.id != process.env.OWNERID) return message.channel.send('Haha no')
    let logFilePath = args[0] ? args[0].toString().toLowerCase() : null
    if (!logFilePath) {
        logFilePath = 'combined.log'
    } else if (logFilePath != 'error' && logFilePath != 'combined') {
        return message.channel.send('That isn\'t a valid log file!')
    } else {
        logFilePath += '.log'
    }
    fs.readFile(logFilePath, 'utf8', async function (err, data) {
        if (err) {
            client.logger.error('Failed getting log with error: ' + err)
        }
        const uploadedPasteLocation = await uploadToHasteBin(client.logger, data)
        if (uploadedPasteLocation) {
            message.channel.send(`Log uploaded: ${uploadedPasteLocation}`)
        } else {
            message.channel.send('There was an error uploading the log to the server, time to check the physical logs! :D')
        }
    });

}

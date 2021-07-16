import {Message} from "discord.js"
import {client} from '../../customDefinitions'
const fs = require('fs')
import fetch from 'node-fetch'

export const name = 'log'
export const description = 'Uploads the log for easy viewing'
export const usage = 'log error|combined'
export const aliases = ['uploadlog']
export async function execute(client: client, message: Message, args) {
    if (message.author.id != process.env.OWNERID) return message.channel.send('Haha no')
    const hasteLocation = process.env.HATEBIN_HOST ?? 'https://hastebin.com'
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
        try {
            const response = await fetch(hasteLocation + '/documents', {
                method: 'POST',
                body: data,
            }).then((r) => r.json())
            console.log(JSON.stringify(response))
            message.channel.send(`Log uploaded: ${hasteLocation}/${response.key}`)
        } catch (err) {
            client.logger.error('Failed uploading log to hastebin with error: ' + err)
        }
    });

}

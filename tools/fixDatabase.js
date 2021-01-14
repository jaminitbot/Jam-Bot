// Runs the things in guildCreate incase the bot is not online when the guild is joined
// TODO: #3 Implement something to delete tables as well as add
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../config.json')
const guildCreate = require('../events/guildCreate')
const dbScript = require('../functions/db')
const db = dbScript.connect(config)

client.on('ready', () => {
  client.guilds.cache.forEach((guild) => {
    console.log('Registering guild: ' + guild)
    guildCreate.register(guild, db, config)
  })
  client.destroy()
})

client.login(config.settings.token)

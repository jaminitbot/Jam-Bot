// Runs the things in guildCreate incase the bot is not online when the guild is joined
// TODO: #3 Implement something to delete tables as well as add
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../config.json')
const guildCreate = require('../events/guildCreate')
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.cached.Database("../" + config.settings.databaseLocation, (err) => {
    if (err) return console.error(err.message)
    console.log('Connected to the SQlite database')
  });

client.on("ready", () => {
    client.guilds.cache.forEach((guild) => {
        guildCreate.register(guild, db, config)
})
})
client.login(config.discord.token)

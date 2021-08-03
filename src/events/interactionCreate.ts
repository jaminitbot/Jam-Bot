import {client} from "../customDefinitions";
import messages = require("../functions/messages")
import {Interaction} from "discord.js";
import {getKey} from "../functions/db";

export default async function register(client:client, interaction:Interaction) {
    if (interaction.isCommand()) { // Is a slash command
        const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName));
        if (!command) return
        if (typeof command.executeSlash != 'function') {
            const guildId = interaction.guild ? interaction.guild.id : 0
            const prefix = await getKey(guildId, 'prefix') || process.env.defaultPrefix
            return interaction.reply({content: `This command hasn't been setup for slash commands yet, please use \`${prefix}${command.name}\` for the time being!`, ephemeral: true})
        }
        try {
            command.executeSlash(client, interaction)
        } catch (error) {
            // Error running command
            client.logger.error('interactionHandler: Command failed with error: ' + error)
            interaction.reply({content: messages.getErrorMessage(), ephemeral: true})
        }
    }
}
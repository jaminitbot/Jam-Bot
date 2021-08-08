import {GuildMember} from "discord.js";

export default async function register(member: GuildMember) {
    if (member.guild.id == '779060204528074783' && !member.pending) {
        try {
            await member.roles.add(process.env.DEFAULT_ROLE)
            // eslint-disable-next-line no-empty
        } catch(err) {
            console.error(err)
        }
    }
}
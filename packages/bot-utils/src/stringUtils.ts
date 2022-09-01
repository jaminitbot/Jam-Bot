import type { Guild, GuildMember, Role, Channel } from "discord.js";
import is_number = require("is-number");
/**
 * Returns a user from a string, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get the user from
 * @returns GuildMember
 */
export async function getUserFromString(
  guild: Guild,
  text: unknown
): Promise<GuildMember | null> {
  try {
    if (!text) return null;
    let stringText = String(text);
    if (stringText.startsWith("<@") && stringText.endsWith(">")) {
      // Mention
      stringText = stringText.slice(2, -1);
      if (stringText.startsWith("!")) {
        stringText = stringText.slice(1);
      }
      if (stringText.startsWith("&")) {
        // Role
        return null;
      }
      if (stringText.startsWith("<#")) {
        // Channel
        return null;
      }
      return await guild.members.fetch(stringText);
    } else if (is_number(text)) {
      // Plain ID
      return await guild.members.fetch(stringText);
    }
  } catch {
    // eslint-disable-next-line no-empty
  }
  return null;
}

/**
 * Returns a user from a string, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get the user from
 * @returns GuildMember
 */
export async function getRoleFromString(
  guild: Guild,
  text: unknown
): Promise<Role | null> {
  try {
    if (!text) return null;
    let stringText = String(text);
    if (stringText.startsWith("<@") && stringText.endsWith(">")) {
      // Mention
      stringText = stringText.slice(2, -1);
      if (stringText.startsWith("<#")) {
        // Channel
        return null;
      }
      if (stringText.startsWith("&")) {
        // Role
        stringText = stringText.slice(1);
      }

      return await guild.roles.fetch(stringText);
    } else if (is_number(stringText)) {
      // Plain ID
      return await guild.roles.fetch(stringText);
    }
  } catch {
    // eslint-disable-next-line no-empty
  }
  return null;
}

/**
 * Returns a channel from a string of text, usually a ID or mention
 * @param guild Guild object
 * @param text Text to get channel from
 * @returns Channel
 */
export async function getChannelFromString(
  guild: Guild,
  text: unknown
): Promise<Channel> {
  try {
    if (!text) return null;
    let stringText = String(text);
    if (stringText.startsWith("<@")) {
      // User or role
      return null;
    }
    if (stringText.startsWith("<#") && stringText.endsWith(">")) {
      stringText = stringText.slice(2, -1);
      return await guild.client.channels.fetch(stringText);
    } else if (is_number(stringText)) {
      return await guild.client.channels.fetch(stringText);
    } else {
      return guild.channels.cache.find(
        (channel) => channel.name.toLowerCase() === stringText
      );
    }
  } catch {
    return null;
  }
}

/**
 * Capitalises the first letter of a sentence
 * @param string Input string
 * @returns string
 */
export function capitaliseSentence(string: string) {
  if (!string) return null;
  const str = String(string);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns a random hex code
 * @returns Hex Code
 */
export function randomHexCode() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

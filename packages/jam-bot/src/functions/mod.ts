import { AnyChannel, Guild, GuildMember, MessageOptions } from "discord.js";
import { BotClient } from "../customDefinitions";
import { getGuildSetting } from "./db";
import ms from "ms";
import is_number from "is-number";
import { capitaliseSentence } from "@jaminitbot/bot-utils";
import db from "../functions/db";
import sentry from "./sentry";

type TaskType = "UNMUTE" | "UNBAN";

/**
 *
 * @param duration duration to parse
 * @returns parsed duration as number
 */
export function parseDuration(duration: string | null) {
  if (!duration) return null;
  const durationArray = String(duration).split(" ");
  let parsedDuration = 0;
  let count = 0;
  while (count < durationArray.length) {
    let splitDuration: string;
    if (is_number(durationArray[count])) {
      if (
        !durationArray[count + 1] ||
        typeof durationArray[count + 1] != "string"
      )
        return null;
      splitDuration = durationArray[count] + " " + durationArray[count + 1];
      count += 2;
    } else {
      splitDuration = durationArray[count];
      count++;
    }
    const tempDuration = ms(splitDuration);
    if (!tempDuration) return null;
    parsedDuration += tempDuration;
  }
  return parsedDuration;
}

type LogType = "messages" | "members" | "server" | "joinLeaves";

/**
 * Posts a message to a specified modlog
 * @param client Discord.js client
 * @param guildId Guild ID
 * @param messageContent Message/embed to send to the modlog
 * @param logType Type of modlog
 * @returns Status code
 */
export async function postToModlog(
  client: BotClient,
  guildId: string,
  messageContent: string | MessageOptions,
  logType: LogType
) {
  const shouldLog = await getGuildSetting(guildId, {
    group: "modlog",
    setting: "log" + capitaliseSentence(logType),
  });
  if (!shouldLog) return 5;
  let channelId = await getGuildSetting(guildId, {
    group: "modlog",
    setting: logType + "ChannelId",
  });
  if (!channelId) {
    channelId = await getGuildSetting(guildId, {
      group: "modlog",
      setting: "mainChannelId",
    });
    if (!channelId) return 4;
  }
  let channel: AnyChannel;
  try {
    channel = await client.channels.fetch(channelId);
  } catch {
    return 1;
  }
  if (!channel) return 1;
  if (!channel.isText) return 2;
  try {
    // @ts-expect-error
    await channel.send(messageContent);
  } catch {
    return 3;
  }
  return 0;
}

async function scheduleTask(
  guildId: string,
  targetId: string,
  type: TaskType,
  duration: number
) {
  try {
    await db.modlogTask.create({
      data: {
        guildId: guildId,
        targetId: targetId,
        type: type,
        time: Date.now() + duration,
      },
    });
  } catch (err) {
    sentry.captureException(err);
    return 1;
  }
  return 0;
}

export async function processTasks(client: BotClient) {
  const tasks = await db.modlogTask.findMany({
    where: {
      time: {
        lte: Date.now(),
      },
    },
  });
  for (const task of tasks) {
    const guild = await client.guilds.fetch(task.guildId);
    if (guild) {
      switch (task.type) {
        case "UNBAN":
          if (guild.me.permissions.has("BAN_MEMBERS")) {
            await unban(guild, task.targetId, "Automatically unbanned");
          }
          break;
      }
    }
    await db.modlogTask.delete({
      where: {
        id: task.id,
      },
    });
  }
}

/**
 * Bans a member from a guild
 * @param guild Guild object
 * @param userId target user ID
 * @param reason Reason to use
 * @param duration Duration to use
 * @returns Status code
 */
export async function ban(
  guild: Guild,
  userId: string,
  reason: string,
  duration: number | null
) {
  const target = await guild.members.fetch(userId);
  if (!target) return 1;
  try {
    await target.ban({ reason: reason, days: 1 });
  } catch {
    return 1; // Unknown error
  }
  if (duration) {
    await scheduleTask(guild.id, target.id, "UNBAN", duration);
  }
  return 0;
}

/**
 * Unbans a member from a guild
 * @param guild Guild object
 * @param userId Target user ID
 * @param reason Reason to use
 * @returns Status code
 */
export async function unban(guild: Guild, userId: string, reason: string) {
  try {
    await guild.bans.remove(userId, reason);
  } catch {
    return 2;
  }
  return 0;
}

/**
 *
 * @param guild Guild object
 * @param userId Target user ID
 * @param reason Reason to use
 * @returns Status code
 */
export async function kick(guild: Guild, userId: string, reason: string) {
  const target = await guild.members.fetch(userId);
  if (!target) return 1;
  try {
    await target.kick(reason);
  } catch {
    return 1; // Unknown error
  }
  return 0;
}

/**
 * Mutes a user in a guild
 * @param guild Guild object
 * @param userId Target user ID
 * @param reason Reason to use
 * @param duration Duration to use
 * @returns Status code
 */
export async function mute(
  guild: Guild,
  userId: string,
  reason: string,
  duration: number | null
) {
  const target = await guild.members.fetch(userId);
  if (!target) return 1;
  if (target.communicationDisabledUntilTimestamp > Date.now()) return 2;
  try {
    await target.timeout(duration, reason);
  } catch (err) {
    console.log(err);
    return 3;
  }
  return 0;
}

/**
 * Unmutes a member from a guild
 * @param guild Guild object
 * @param userId Target user ID
 * @param reason Reason to use
 * @returns Status code
 */
export async function unmute(guild: Guild, userId: string, reason: string) {
  const target = await guild.members.fetch(userId);
  if (!target) return 1;
  try {
    await target.timeout(null, reason);
  } catch {
    return 2;
  }
  return 0;
}

/**
 * Checks if a user is moddable by the bot, and the moderator
 * @param guild Guild object
 * @param targetId Target user ID
 * @param modId Moderator ID
 * @returns Status code
 */
export async function moddable(guild: Guild, targetId: string, modId: string) {
  let targetUser: GuildMember;
  let modUser: GuildMember;
  try {
    targetUser = await guild.members.fetch(targetId);
    modUser = await guild.members.fetch(modId);
  } catch {
    return 1;
  }
  if (targetId == modId) return 2;
  if (!targetUser.manageable) return 3;
  const modUserRolePosition = modUser.roles.highest.position;
  const targetUserPosition = targetUser.roles.highest.position;
  if (modUserRolePosition <= targetUserPosition) return 4;
  return 0;
}

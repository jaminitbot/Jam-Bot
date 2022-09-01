import { GuildMember, EmbedBuilder } from "discord.js";
import i18next from "i18next";
import { BotClient } from "../customDefinitions";
import { postToModlog } from "../functions/mod";

export const name = "guildMemberRemove";

export async function register(client: BotClient, member: GuildMember) {
  const embed = new EmbedBuilder();
  embed.setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL() });
  embed.setTitle(i18next.t("events:guildMemberRemove.USER_LEFT"));
  embed.setDescription(
    i18next.t("events:guildMemberRemove.EMBED_DESCRIPTION", {
      tag: member.user.tag,
      numberOfUsers: member.guild.memberCount,
    })
  );
  embed.setFooter({
    text: i18next.t("events:userLogs.USER_ID", { id: member.id }),
  });
  embed.setTimestamp(Date.now());
  embed.setColor("#A8201A");
  await postToModlog(
    client,
    member.guild.id,
    { embeds: [embed] },
    "joinLeaves"
  );
}

import {
  ChatInputCommandInteraction,
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  EmbedBuilder,
  TextChannel,
  User,
  Channel,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient, Permissions } from "../../customDefinitions";
import { registerSlashCommands } from "../../functions/registerCommands";
import i18next from "i18next";
import { getGuildSetting, setGuildSetting } from "../../functions/db";

export const name = "util";
export const description = "Various util commands";
export const permissions: Permissions = ["OWNER"];
export const usage = "util thing";
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addSubcommandGroup((group) =>
    group
      .setName("db")
      .setDescription("DB related commands")
      .addSubcommand((command) =>
        command
          .setName("getguildsetting")
          .setDescription("Gets the value of a setting in a guild")
          .addStringOption((option) =>
            option
              .setName("guildid")
              .setDescription("Guild ID to get the setting for")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("setting")
              .setDescription("Setting to get")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option.setName("group").setDescription("Setting group to use")
          )
      )
      .addSubcommand((command) =>
        command
          .setName("setguildsetting")
          .setDescription("Sets the value of a setting in a guild")
          .addStringOption((option) =>
            option
              .setName("guildid")
              .setDescription("Target guild ID")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("setting")
              .setDescription("Setting to get")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("value")
              .setDescription("Value to set the setting")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option.setName("group").setDescription("Setting group to use")
          )
      )
  )
  .addSubcommandGroup((group) =>
    group
      .setName("lookup")
      .setDescription("Commands to lookup various things")
      .addSubcommand((command) =>
        command
          .setName("guild")
          .setDescription("Shows information about a guild")
          .addStringOption((option) =>
            option.setName("id").setDescription("Guild ID").setRequired(true)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("user")
          .setDescription("Shows information about a user")
          .addStringOption((option) =>
            option.setName("id").setDescription("User ID").setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("guildid")
              .setDescription("Guild ID")
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName("showpermissions")
              .setDescription("Whether to show member permissions")
              .setRequired(false)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("channel")
          .setDescription("Shows information about a channel")
          .addStringOption((option) =>
            option.setName("id").setDescription("Channel ID").setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("guildid")
              .setDescription("Guild ID")
              .setRequired(false)
          )
      )
  )
  .addSubcommandGroup((group) =>
    group
      .setName("misc")
      .setDescription("Misc commands")
      .addSubcommand((command) =>
        command.setName("deployslash").setDescription("Deploys slash commands")
      )
      .addSubcommand((command) =>
        command.setName("shutdown").setDescription("Shuts down the bot")
      )
      .addSubcommand((command) =>
        command
          .setName("say")
          .setDescription("Sends a message in a certain channel")
          .addStringOption((option) =>
            option
              .setName("message")
              .setDescription("Message to send")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("channelid")
              .setDescription("Channel ID to send the message in")
              .setRequired(false)
          )
          .addStringOption((option) =>
            option
              .setName("messageid")
              .setDescription("Message ID to reply to")
              .setRequired(false)
          )
      )
  );

function makeGetSetSettingEmbed(options: {
  guildId: string;
  group?: string;
  setting: string;
  value?: string;
  type: "SET_SETTING" | "GET_SETTING";
}) {
  const { guildId, group, setting, value, type } = options;
  const embedTitle =
    type == "SET_SETTING"
      ? i18next.t("util.SET_SETTING_TITLE")
      : i18next.t("util.GET_SETTING_TITLE");
  const embed = new EmbedBuilder()
    .setTitle(embedTitle)
    .addFields([
      { name: i18next.t("util.GUILD_ID"), value: guildId, inline: true },
    ]);
  group &&
    embed.addFields([
      { name: i18next.t("util.SETTING_GROUP"), value: group, inline: true },
    ]);
  embed.addFields([
    { name: i18next.t("util.SETTING"), value: setting, inline: true },
  ]);
  value &&
    embed.addFields([
      { name: i18next.t("util.VALUE"), value: value, inline: true },
    ]);
  return embed;
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  return;
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  switch (interaction.options.getSubcommandGroup()) {
    case "db": {
      switch (interaction.options.getSubcommand()) {
        case "setguildsetting": {
          const guildId = interaction.options.getString("guildid");
          const group = interaction.options.getString("group");
          const setting = interaction.options.getString("setting");
          const value = interaction.options.getString("value");
          try {
            await setGuildSetting(guildId, {
              setting: setting,
              group: group,
              value: value,
            });
          } catch (err) {
            const embed = new EmbedBuilder().setDescription(
              i18next.t("general:UNKNOWN_ERROR")
            );
            await interaction.reply({ embeds: [embed] });
            return;
          }
          const embed = makeGetSetSettingEmbed({
            guildId: guildId,
            group: group,
            setting: setting,
            value: value,
            type: "SET_SETTING",
          });
          await interaction.reply({ embeds: [embed] });
          break;
        }
        case "getguildsetting": {
          const guildId = interaction.options.getString("guildid");
          const group = interaction.options.getString("group");
          const setting = interaction.options.getString("setting");
          const value = await getGuildSetting(guildId, {
            group: group,
            setting: setting,
          });
          const embed = makeGetSetSettingEmbed({
            guildId: guildId,
            group: group,
            setting: setting,
            value: value,
            type: "GET_SETTING",
          });
          await interaction.reply({ embeds: [embed] });
          break;
        }
      }
      break;
    }
    case "lookup": {
      switch (interaction.options.getSubcommand()) {
        case "guild": {
          const guildId = interaction.options.getString("id");
          let guild: Guild;
          try {
            guild = await interaction.client.guilds.fetch(guildId);
          } catch {
            return interaction.reply({
              content: "Error getting guild",
              ephemeral: true,
            });
          }
          if (!guild)
            return interaction.reply({
              content: "Guild not found",
              ephemeral: true,
            });
          if (!guild.available)
            return interaction.reply({
              content: "Guild not avaliable",
              ephemeral: true,
            });
          const guildOwner = await guild.fetchOwner();
          let botPermissions = guild.members.me.permissions
            .toArray()
            .join(", ");
          botPermissions = botPermissions
            ? botPermissions.substring(0, botPermissions.length)
            : "NONE";
          if (botPermissions.includes("ADMINISTRATOR,"))
            botPermissions = "ADMINISTRATOR";
          const embed = new EmbedBuilder();
          embed
            .setTitle("Guild Lookup")
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .addFields([
              { name: "Name", value: guild.name, inline: true },
              { name: "ID", value: guild.id, inline: true },
              {
                name: "Created At",
                value: guild.createdAt.toUTCString(),
                inline: true,
              },
            ]);
          guild.description &&
            embed.addFields([
              {
                name: "Guild Description",
                value: guild.description,
                inline: true,
              },
            ]);
          embed.addFields([
            { name: "Owner Tag", value: guildOwner.user.tag, inline: true },
            { name: "Owner ID", value: guildOwner.user.id, inline: true },
            {
              name: "Member Count",
              value: String(
                guild.memberCount ??
                  guild.approximateMemberCount ??
                  "Couldn't fetch"
              ),
              inline: true,
            },
            {
              name: "Partnered",
              value: String(guild.partnered).toUpperCase(),
              inline: true,
            },
            {
              name: "Verified",
              value: String(guild.verified).toUpperCase(),
              inline: true,
            },
            {
              name: "Premium Tier",
              value: String(guild.premiumTier),
              inline: true,
            },
          ]);
          guild.vanityURLCode &&
            embed.addFields([
              {
                name: "Vanity URL Code",
                value: guild.vanityURLCode,
                inline: true,
              },
            ]);
          embed.addFields([
            {
              name: "Preferred Locale",
              value: String(guild.preferredLocale),
              inline: true,
            },
            {
              name: "Bot Permissions",
              value: `\`${botPermissions}\``,
              inline: false,
            },
            { name: "Shard ID", value: String(guild.shardId), inline: true },
          ]);
          await interaction.reply({ embeds: [embed] });
          break;
        }
        case "user": {
          const userId = interaction.options.getString("id");
          const guildId = interaction.options.getString("guildid");
          let user: User;
          try {
            user = await interaction.client.users.fetch(userId);
          } catch {
            await interaction.reply({
              content: "Error fetching user",
              ephemeral: true,
            });
            return;
          }
          const embed = new EmbedBuilder();
          const embeds = [];
          let userFlags = user.flags.toArray().join(", ");
          userFlags = userFlags
            ? userFlags.substring(0, userFlags.length)
            : "NONE";
          embed
            .setTitle("User Lookup")
            .setAuthor({ name: user.tag, iconURL: user.avatarURL() })
            .addFields([
              { name: "Tag", value: user.tag, inline: true },
              { name: "ID", value: user.id, inline: true },
              {
                name: "Bot",
                value: String(user.bot).toUpperCase(),
                inline: true,
              },
              {
                name: "Created At",
                value: user.createdAt.toUTCString(),
                inline: true,
              },
              { name: "Flags", value: `\`${userFlags}\``, inline: true },
            ]);
          embeds.push(embed);
          if (guildId) {
            const memberEmbed = new EmbedBuilder();
            memberEmbed.setTitle("Member Lookup");
            let guild: Guild;
            try {
              guild = await interaction.client.guilds.fetch(guildId);
              // eslint-disable-next-line no-empty
            } catch {}
            if (guild) {
              if (guild.available) {
                let member: GuildMember;
                try {
                  member = await guild.members.fetch(userId);
                  // eslint-disable-next-line no-empty
                } catch {}
                if (member) {
                  memberEmbed.setAuthor({
                    name: member.nickname ?? user.tag,
                    iconURL: member.displayAvatarURL() ?? user.defaultAvatarURL,
                  });
                  const showPermissions =
                    interaction.options.getBoolean("showpermissions");
                  const isGuildOwner = guild.ownerId == userId;
                  let memberPermissions = member.permissions
                    .toArray()
                    .join(", ");
                  memberPermissions = memberPermissions
                    ? memberPermissions.substring(0, memberPermissions.length)
                    : "NONE";
                  memberEmbed
                    .addFields([
                      {
                        name: "Nickname",
                        value: member.nickname,
                        inline: true,
                      },
                    ])
                    .addFields([
                      {
                        name: "Premium Since",
                        value: member.premiumSince
                          ? member.premiumSince.toUTCString()
                          : "N/A",
                        inline: true,
                      },
                      {
                        name: "Manageable",
                        value: String(member.manageable).toUpperCase(),
                        inline: true,
                      },
                    ]);
                  isGuildOwner &&
                    memberEmbed.addFields([
                      { name: "Guild Owner", value: "TRUE", inline: true },
                    ]);
                  showPermissions &&
                    memberEmbed.addFields([
                      {
                        name: "Permissions",
                        value: `\`${memberPermissions}\``,
                        inline: true,
                      },
                    ]);
                  !member.manageable &&
                    memberEmbed.addFields([
                      {
                        name: "Highest Role Position",
                        value: String(member.roles?.highest?.position) || "N/A",
                        inline: true,
                      },
                    ]);
                  !member.manageable &&
                    memberEmbed.addFields([
                      {
                        name: "Bot Highest Role Position",
                        value:
                          String(guild.members.me.roles?.highest?.position) ||
                          "N/A",
                        inline: true,
                      },
                    ]);
                } else {
                  memberEmbed.addFields([
                    { name: "Guild Member", value: "Error fetching" },
                  ]);
                }
              } else {
                memberEmbed.addFields([
                  { name: "Guild", value: "Not avaliable" },
                ]);
              }
            } else {
              memberEmbed.addFields([
                { name: "Guild", value: "Error fetching" },
              ]);
            }
            embeds.push(memberEmbed);
          }
          await interaction.reply({ embeds: embeds });
          break;
        }
        case "channel": {
          const channelId = interaction.options.getString("id");
          const guildId = interaction.options.getString("guildid");
          let channel: Channel;
          try {
            channel = await interaction.client.channels.fetch(channelId);
            // eslint-disable-next-line no-empty
          } catch {}
          if (!channel) {
            await interaction.reply({
              content: "Error fetching channel",
              ephemeral: true,
            });
            return;
          }
          const embed = new EmbedBuilder();
          embed.setTitle("Channel Lookup");
          let guildChannel: GuildChannel;
          if (guildId) {
            let guild: Guild;
            try {
              guild = await interaction.client.guilds.fetch(guildId);
              // eslint-disable-next-line no-empty
            } catch {}
            if (guild) {
              guildChannel = await guild.channels.fetch(channelId);
              embed.addFields([
                { name: "Name", value: guildChannel.name, inline: true },
              ]);
            }
          }
          embed.addFields([{ name: "ID", value: channel.id, inline: true }]);
          if (guildChannel) {
            embed.addFields([
              { name: "Guild ID", value: guildChannel.guild.id, inline: true },
            ]);
          }
          embed.addFields([
            { name: "Type", value: String(channel.type), inline: true },
            {
              name: "Created At",
              value: channel.createdAt.toUTCString(),
              inline: true,
            },
          ]);
          if (guildChannel) {
            guildChannel.parent &&
              embed.addFields([
                {
                  name: "Category Name",
                  value: guildChannel.parent.name,
                  inline: true,
                },
              ]);
            embed.addFields([
              {
                name: "Manageable",
                value: String(guildChannel.manageable).toUpperCase(),
                inline: true,
              },
              {
                name: "Viewable",
                value: String(guildChannel.viewable).toUpperCase(),
                inline: true,
              },
            ]);
          }
          await interaction.reply({ embeds: [embed] });
          break;
        }
      }
      break;
    }
    case "misc": {
      switch (interaction.options.getSubcommand()) {
        case "deployslash": {
          await interaction.deferReply();
          await registerSlashCommands(client);
          await interaction.editReply({
            content: i18next.t("util.RELOADED_SLASH_COMMANDS"),
          });
          break;
        }

        case "shutdown": {
          await interaction.reply(i18next.t("util.SHUTTING_DOWN"));
          process.emit("SIGINT");
          break;
        }
        case "say": {
          const thingToSay = interaction.options.getString("message");
          const messagetoReplyToID = interaction.options.getString("messageid");
          let channel: TextChannel;
          try {
            // @ts-expect-error
            channel = await interaction.client.channels.fetch(
              interaction.options.getString("channelid") ??
                interaction.channel.id
            );
            interaction.options.get;
          } catch {
            await interaction.reply({
              content: "Error fetching channel",
              ephemeral: true,
            });
            return;
          }
          if (channel.isTextBased()) {
            if (!messagetoReplyToID) {
              try {
                await channel.send(thingToSay);
              } catch {
                await interaction.reply({
                  content: "Error sending message in channel",
                });
                return;
              }
            } else {
              try {
                const message = await channel.messages.fetch(
                  messagetoReplyToID
                );
                message.reply(thingToSay);
              } catch {
                await interaction.reply({
                  content: "Error sending message in channel",
                });
                return;
              }
            }
            await interaction.reply({
              content: "Successfully sent message",
              ephemeral: interaction.channel.id == channel.id,
            });
          } else {
            await interaction.reply({
              content: "Specified channel wasn't a text channel",
              ephemeral: true,
            });
          }
          break;
        }
      }
      break;
    }
  }
}

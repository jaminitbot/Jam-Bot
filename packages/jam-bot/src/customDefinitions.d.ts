import {
  AutocompleteInteraction,
  ButtonInteraction,
  Client,
  Collection,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  PermissionString,
  SelectMenuInteraction,
} from "discord.js";
import { Logger } from "winston";
import { SlashCommandBuilder } from "@discordjs/builders";

type Permission = PermissionString | "OWNER";
export type Permissions = Array<Permission>;

export interface Command {
  name: string;
  description: string;
  usage: string;
  aliases: Array<string> | undefined;
  allowInDm: boolean | undefined;
  permissions: Array<Permission> | undefined;
  slashData: SlashCommandBuilder | undefined;
  rateLimit: number | undefined;
  execute: (
    client: BotClient,
    message: Message,
    args: Array<unknown>
  ) => Promise<void> | undefined;
  executeAutocomplete: (
    client: BotClient,
    interaction: AutocompleteInteraction
  ) => Promise<void> | undefined;
  executeSelectMenu: (
    client: BotClient,
    interaction: SelectMenuInteraction
  ) => Promise<void> | undefined;
  executeSlash: (
    client: BotClient,
    interaction: CommandInteraction
  ) => Promise<void> | undefined;
  executeButton: (
    client: BotClient,
    interaction: ButtonInteraction
  ) => Promise<void> | undefined;
  executeContextMenu: (
    client: BotClient,
    interaction: ContextMenuInteraction
  ) => Promise<void> | undefined;
  interactionType: number | undefined;
}

interface Event {
  name: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  register: Function;
}

export interface BotClient extends Client {
  events: Collection<string, Event>;
  logger: Logger;
  commands: Collection<string, Command>;
}

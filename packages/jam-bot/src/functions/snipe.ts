import { Message, User } from "discord.js";
import i18next from "i18next";
import { SNIPE_DURATION } from "../consts";
import { isBotOwner, removeItemFromArray } from "./util";

export interface MessageSniped {
  channel: string;
  oldMessage: string;
  newMessage: string;
  user: User;
  type: string;
  isOwner: boolean;
}

const buffer = new Map<string, Array<MessageSniped>>();

/**
 *
 * @param message The message
 * @param oldMessage Old message (incase of message edits)
 * @param type Delete or edit
 */
export async function inputSnipe(
  message: Message,
  oldMessage: Message,
  type: string
): Promise<void> {
  if (!oldMessage) {
    // @ts-expect-error
    oldMessage = {
      content: null,
    };
  }
  const messageObject: MessageSniped = {
    channel: message.channel.id,
    oldMessage:
      oldMessage.content || i18next.t("events:messageLogs.NO_CONTENT"),
    newMessage: message.content || i18next.t("events:messageLogs.NO_CONTENT"),
    user: message.author,
    type: type,
    isOwner: isBotOwner(message.author.id),
  };
  const channelArray = buffer.get(message.channel.id) ?? [];
  channelArray.push(messageObject);
  buffer.set(message.channel.id, channelArray);
  setTimeout(
    () =>
      buffer.set(
        message.channel.id,
        removeItemFromArray(buffer.get(message.channel.id), messageObject)
      ),
    SNIPE_DURATION * 1000
  );
}

/**
 *
 * @returns Array of sniped messages
 */
export function returnSnipedMessages(
  channelId: string
): Array<MessageSniped> | null {
  const bufferValue = buffer.get(channelId);
  if (!bufferValue) return null;
  return bufferValue.reverse();
}

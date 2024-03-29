import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default (() => {
  return prisma;
})();

interface GetGuildSettingOptions {
  setting: string;
  group?: string | undefined;
  bypassCache?: boolean | undefined;
}

/**
 * Gets a particular key for the guild
 * @param guildId The guild identifier
 * @param key The key or getGuildSettingoptions
 * @returns String
 */
export async function getGuildSetting(
  guildId: string | number,
  key: string | GetGuildSettingOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  let group: string | null;
  if (typeof key == "object") {
    // Using getGuildSetting options
    const tempObject: GetGuildSettingOptions = key;
    key = tempObject.setting;
    group = tempObject.group;
  }
  const response = await prisma.guildSetting.findUnique({
    where: {
      guildId: String(guildId),
    },
  });
  if (!response) return null;
  if (group) {
    // @ts-ignore-error
    if (!response[group]) return null;
    // @ts-ignore-error
    return response[group][key] ?? null;
  } else {
    // @ts-ignore-error
    return response[key] ?? null;
  }
}

interface SetGuildSettingOptions {
  setting: string;
  group?: string | undefined;
  value: unknown;
}

/**
 * Sets a specified key for the guild
 * @param guildId The guild identifier
 * @param key The database key to update in the database
 * @param value The value of the key to set
 * @returns Boolean
 */
export async function setGuildSetting(
  guildId: string,
  key: string | SetGuildSettingOptions,
  value?: unknown
): Promise<void> {
  let group: string | undefined;
  if (typeof key == "object") {
    const tempObject: SetGuildSettingOptions = key;
    key = tempObject.setting;
    value = tempObject.value;
    group = tempObject.group;
  } else if (!value) {
    throw "Value not specified";
  }
  const dataToSet = {
    guildId: guildId,
  };
  if (group) {
    const groupValue = await prisma.guildSetting.findUnique({
      where: {
        guildId: guildId,
      },
    });
    if (groupValue) {
      // @ts-expect-error
      dataToSet[group] = { ...groupValue[group] };
    } else {
      // @ts-expect-error
      dataToSet[group] = {};
    }
    // @ts-expect-error
    dataToSet[group][key] = value;
  } else {
    // @ts-expect-error
    dataToSet[key] = value;
  }
  await prisma.guildSetting.upsert({
    where: {
      guildId: guildId,
    },
    update: dataToSet,
    create: dataToSet,
  });
}

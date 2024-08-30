import { ChatInputCommandInteraction, Message } from "discord.js";
import { JSONFilePreset } from "lowdb/node";
import path from "node:path";

import { Low } from "lowdb";
import { LLMMessage } from "./api/llm/types";
import { initDir, initFile } from "./file";
import { Character } from "./api/kim";
import { assistantFirstPrompt, systemPromptBuilder } from "./prompt";

interface SavedMessages {
  messages: Array<LLMMessage>;
  summary?: string;
}

export const EMPTY_DB: SavedMessages = {
  messages: [],
};
const DIR_DATABASE = path.join(process.cwd(), "database");
export const ACTIVE_DATABASES = new Map<string, Low<SavedMessages>>();

export const initDbDir = () => initDir(DIR_DATABASE);

export const getGuildDatabases = (guildId: string) =>
  path.join(DIR_DATABASE, guildId);

export const getCharacterDb = (guildId: string, character: Character) =>
  path.join(getGuildDatabases(guildId), `${character.id}.json`);

export const initCharDb = async (guildId: string, character: Character) => {
  const PATH_GUILD_DATABASES = getGuildDatabases(guildId);
  const PATH_CHARACTER_DATABASE = getCharacterDb(guildId, character);

  await initDir(PATH_GUILD_DATABASES);
  await initFile(PATH_CHARACTER_DATABASE, JSON.stringify(EMPTY_DB));

  const db = await JSONFilePreset(PATH_CHARACTER_DATABASE, EMPTY_DB);

  await db.read();
  if (db.data.messages.length === 0) {
    const firstMessages: Array<LLMMessage> = [
      { role: "system", content: systemPromptBuilder(character) },
      {
        role: "assistant",
        content: assistantFirstPrompt(character),
      },
    ];

    await db.update((data) => (data.messages = firstMessages));
  }

  ACTIVE_DATABASES.set(guildId, db);

  return db;
};

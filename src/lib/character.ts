import { CacheType, ChatInputCommandInteraction, Message } from "discord.js";
import { Character, kim } from "./api/kim";

export const CHARACTERS = new Map<string, Character>();

const REGEX_CHARACTER_URL =
  /https:\/\/janitorai\.com\/characters\/([a-zA-Z0-9-]+)_([a-z0-9-]+)/;

export const isValidCharacterUrl = (url: string) => {
  return REGEX_CHARACTER_URL.test(url);
};

export const parseCharacterId = (url: string) => {
  if (!isValidCharacterUrl(url)) throw Error("Invalid Character URL");

  const urlObj = new URL(url);
  const slug = urlObj.pathname.split("/").at(-1);
  const characterId = slug?.split("_").at(0);

  if (!characterId) throw Error("No Character ID found in the URL");

  return characterId;
};

export const fetchCharacter = async (guildId: string, url: string) => {
  const id = parseCharacterId(url);
  const response = await kim.characterDetails({ params: { id } });

  console.log(`Fetched character: ${response.name} for Guild: ${guildId}`);

  CHARACTERS.set(guildId, response);
  return response;
};

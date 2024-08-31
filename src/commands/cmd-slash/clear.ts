import { SlashCommandBuilder } from "discord.js";
import { JSONFilePreset } from "lowdb/node";
import { CHARACTERS, fetchCharacter } from "~/lib/character";
import { EMPTY_DB, getCharacterDb } from "~/lib/db";
import { ImportedSlashCommand } from "..";

export const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Clear a character's chat history")
  .addStringOption((option) =>
    option
      .setName("url")
      .setDescription("Janitor AI Character URL")
      .setRequired(true)
  );

export const execute: ImportedSlashCommand["execute"] = async (interaction) => {
  if (!interaction.inGuild())
    return interaction.reply("This command can only be used in a server");

  const url = interaction.options.getString("url") ?? "";
  const character = await fetchCharacter(interaction.guildId, url);
  CHARACTERS.delete(interaction.guildId);

  const dbPath = getCharacterDb(interaction.guildId, character);

  const db = await JSONFilePreset(dbPath, EMPTY_DB);

  db.data = EMPTY_DB;
  await db.write();

  await interaction.reply(`Cleared database for ${character.name}`);
};
